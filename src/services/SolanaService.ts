import {
  Account,
  TOKEN_PROGRAM_ID,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import solanaWeb3, {
  AccountInfo,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  ParsedAccountData,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import base58 from 'bs58';
import { useAxios } from 'customHooks/axiosHelper';
import { HDKey } from 'ed25519-keygen/hdkey';
import { encodeBase58 } from 'ethers';
import { t } from 'i18next';
import { store } from 'store/index';
import {
  findValueByKey,
  getWalletAddress,
  showToast,
} from 'theme/Helper/common/Function';
import { NetWorkType, PAGINATION_COUNT_20 } from 'theme/Helper/constant';
import {
  ActivityItemInterface,
  ExistingNetworksItem,
  SolanaTokenListResponseContent,
  SolanaTokenListResponseRoot,
} from 'types/apiResponseInterfaces';
import { ActivityRequestType, GasFeeData } from 'types/applicationInterfaces';

import Bip39Manager from './Bip39Manager';
import StoreUpdateReduxWalletStateService from './StoreUpdateReduxWalletStateService';
import WalletCommonService from './WalletCommonService';
import WalletSigner from './WalletSigner';

let observerIds: number[] = [];
let solanaConnectionObject: Connection;
let solanaNativeTokenObserverID: number;

let cachedWallet: any;

const SolanaService = () => {
  /**
   * Retrieves the wallet using the provided mnemonic seed.
   * @param {string} mnemonic - The mnemonic seed.
   */
  const getWalletUsingSeed = async (
    mnemonic: string,
    pathIndex: string = '0',
  ) => {
    try {
      if (cachedWallet) {
        return cachedWallet;
      }
      const seed = Bip39Manager().getSeedUsingMnemonic(mnemonic);

      const hd = HDKey.fromMasterSeed(seed.toString('hex'));

      const derivationPath = `m/44'/501'/0'/${pathIndex}'`;
      const keypair = Keypair.fromSeed(hd.derive(derivationPath).privateKey);

      const solanaAddress = keypair.publicKey.toBase58();
      const secretKey = keypair.secretKey;

      const privateKey = encodeBase58(secretKey);

      cachedWallet = { address: solanaAddress, privateKey, secretKey };
      return cachedWallet;
    } catch (error: any) {
      showToast('error', t('common:something_went_wrong_please_try_again'));
      console.log('Failed to fetch wallet SolanaService: ' + error.message);
    }
  };

  /**
   * Retrieves the wallet using the provided private key.
   * @param {string} privateKey - The private key.
   */
  const getWalletUsingPrivateKey = (privateKey: string) => {
    try {
      const keypair = Keypair.fromSecretKey(base58.decode(privateKey));

      const solanaAddress = keypair.publicKey.toString();
      return solanaAddress;
    } catch (error: any) {
      showToast('error', t('onBoarding:invalid_private_key'));
      console.log('getWalletUsingPrivateKey error: ' + error.message);
      return '';
    }
  };

  /**
   * Creates a provider using the specified URL.
   * @param {string} url - The URL for the provider.
   */
  const createProvider = (url: string) => {
    if (solanaConnectionObject?.rpcEndpoint !== url) {
      solanaConnectionObject = new Connection(url, {
        wsEndpoint: url?.replace('https', 'wss'),
        commitment: 'confirmed',
      });
    }
    return solanaConnectionObject;
  };

  const getProvider = (item: ExistingNetworksItem) => {
    return createProvider(item?.providerNetworkRPC_URL);
  };

  /**
   * Adds a listener for changes in the Solana native token balance for a specified address.
   * @param {ExistingNetworksItem} tokenObj - The token object representing the network.
   * @param {string} address - The wallet address to watch for changes.
   */
  const addSolanaNativeTokenListener = async (
    tokenObj: ExistingNetworksItem,
    address: string,
  ) => {
    const ACCOUNT_TO_WATCH = new PublicKey(address); // Replace with your own Wallet Address
    getProvider(tokenObj).removeAccountChangeListener(
      solanaNativeTokenObserverID,
    );
    const subscriptionId = getProvider(tokenObj).onAccountChange(
      ACCOUNT_TO_WATCH,
      async updatedAccountInfo => {
        StoreUpdateReduxWalletStateService().updateBalanceInStore({
          tokenName: tokenObj.shortName,
          tokenBalance: (
            updatedAccountInfo?.lamports / LAMPORTS_PER_SOL
          ).toString(),
        });
      },
      'finalized',
    );
    solanaNativeTokenObserverID = subscriptionId;
  };

  /**
   * Adds an event listener for changes in the token balance for a specified address on the specified network.
   * @param {ExistingNetworksItem} tokenObj - The token object representing the network.
   * @param {string} address - The wallet address to watch for changes.
   */
  const addEventListener = async (
    tokenObj: ExistingNetworksItem,
    address: string,
  ) => {
    const ACCOUNT_TO_WATCH = new PublicKey(address);

    const mint = new PublicKey(tokenObj?.tokenContractAddress);
    const owner = new PublicKey(address);

    const tokenAddress = await getAssociatedTokenAddress(mint, owner);
    const mintTokenAccountAddress = new PublicKey(tokenAddress);

    const subscriptionId = getProvider(tokenObj).onAccountChange(
      mintTokenAccountAddress,
      async updatedAccountInfo => {
        let mintInfo = await getProvider(tokenObj).getParsedAccountInfo(
          new PublicKey(tokenAddress),
        );
        const updatedMintBalance =
          mintInfo.value?.data?.parsed?.info.tokenAmount.uiAmountString;

        StoreUpdateReduxWalletStateService().updateBalanceInStore({
          tokenName: tokenObj.shortName,
          tokenBalance: updatedMintBalance,
        });

        console.log(
          `---Event Notification for ${ACCOUNT_TO_WATCH.toString()}--- \nNew Account Balance: ${JSON.stringify(
            updatedAccountInfo,
          )}`,
        );
      },
      'finalized',
    );
    observerIds.push(subscriptionId);
  };

  /**
   * Removes all event listeners associated with the Solana connection.
   */
  const removeEventListeners = () => {
    observerIds?.forEach(item => {
      solanaConnectionObject.removeAccountChangeListener(item);
    });
    solanaConnectionObject = null;
    observerIds = [];
  };

  /**
   * Removes the event listener associated with the Solana native token.
   */
  const removeSolanaNativeTokenEventListeners = () => {
    if (!solanaNativeTokenObserverID) {
      return;
    }
    solanaConnectionObject?.removeAccountChangeListener(
      solanaNativeTokenObserverID,
    );
  };

  /**
   * Retrieves the balance of a specific token associated with a given address on the Solana blockchain.
   * @param address The wallet address for which the balance is to be retrieved.
   * @param tokenObj An object representing the existing network and related information.
   * @returns A promise that resolves to the balance as a string.
   */
  const getBalance = async (
    address: string,
    tokenObj: ExistingNetworksItem,
  ): Promise<string> => {
    try {
      const pubKey = new PublicKey(address);
      const balance = await getProvider(tokenObj).getBalance(pubKey);

      const currentUserWalletAddress = getWalletAddress(
        tokenObj.networkName,
        tokenObj.isEVMNetwork,
      );
      if (currentUserWalletAddress === address) {
        return balance ? balance.toString() : '0';
      } else {
        return '0';
      }
    } catch (error: any) {
      console.log('Failed to fetch balance SOL: ' + error.message);
      return '0';
    }
  };

  /**
   * Sends Solana tokens to the specified address.
   * @param toAddress The recipient's wallet address.
   * @param amount The amount of Solana to be sent.
   * @param gasPrice The gas price for the transaction.
   * @param gasLimit The gas limit for the transaction.
   * @param onTransactionRequest A function that handles the transaction request.
   * @param onTransactionDone A function that handles the successful completion of the transaction.
   * @param onTransactionFail A function that handles failed transactions.
   * @param tokenObj An object representing the existing network and related information.
   */
  const sendNativeToken = async (
    toAddress: string,
    amount: string,
    gasPrice: number,
    _gasLimit: number,
    onTransactionRequest: (request?: {}) => void,
    onTransactionDone: (transaction: {}) => void,
    onTransactionFail: (transaction: {}) => void,
    tokenObj: ExistingNetworksItem,
  ) => {
    try {
      const connection = getProvider(tokenObj);
      const address = getWalletAddress(
        tokenObj?.networkName,
        tokenObj?.isEVMNetwork,
      );

      const fromPubkey = new PublicKey(address ?? '');
      const toPubkey = new PublicKey(toAddress);

      const recentBlockhash = await connection.getLatestBlockhash();

      const sendSolInstruction = solanaWeb3.SystemProgram.transfer({
        fromPubkey: fromPubkey,
        toPubkey: toPubkey,
        lamports: parseFloat(amount * solanaWeb3.LAMPORTS_PER_SOL),
      });
      const transaction = new solanaWeb3.Transaction();
      transaction.feePayer = fromPubkey;
      transaction.recentBlockhash = recentBlockhash.blockhash;
      const fees = await transaction.getEstimatedFee(connection);
      const PRIORITY_GAS_PRICE = gasPrice - (fees ?? 0);
      const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: PRIORITY_GAS_PRICE,
      });
      onTransactionRequest({
        gasPrice: fees,
      });
      transaction.add(PRIORITY_FEE_IX).add(sendSolInstruction);

      const signer = await WalletSigner().signWallet(tokenObj);

      const tx = await solanaWeb3.sendAndConfirmTransaction(
        connection,
        transaction,
        [signer],
      );

      if (tx) {
        onTransactionDone({
          gasPrice: fees,
          hash: tx,
          status: '1',
        });
        WalletCommonService().getBalanceAfterTransaction(tokenObj);
      } else {
        onTransactionFail(
          t('onBoarding:something_went_wrong_please_try_again'),
        );
      }
    } catch (error: any) {
      console.log('error/>>?>>>?????', error);
      onTransactionFail(t('onBoarding:something_went_wrong_please_try_again'));
    }
  };

  /**
   * Retrieves custom token details from the Solana network.
   * @param tokenObj An object representing the existing network and related information.
   * @returns A promise that resolves to the Solana token list response content.
   */
  const getCustomTokenInformation = async (
    contractAddress: string,
    tokenObj: Pick<
      ExistingNetworksItem,
      | 'providerNetworkRPC_URL'
      | 'tokenContractAddress'
      | 'providerNetworkRPC_Network_Name'
      | 'networkName'
    >,
  ): Promise<SolanaTokenListResponseContent> => {
    const tempTokenObj = {
      ...tokenObj,
      tokenContractAddress: contractAddress,
    };
    const parsedResponse = await fetchTokenInfo(tempTokenObj);
    const balance = await getSingleSolanaCustomTokenBalance(tempTokenObj);
    return {
      ...parsedResponse.content[0],
      balance: balance ?? 0,
    };
  };

  const getSingleSolanaCustomTokenBalance = async (
    tokenObj: Pick<
      ExistingNetworksItem,
      | 'providerNetworkRPC_URL'
      | 'tokenContractAddress'
      | 'providerNetworkRPC_Network_Name'
      | 'networkName'
    >,
  ) => {
    try {
      const walletAddress = getWalletAddress(tokenObj?.networkName, false);
      const ownerAccount = new PublicKey(walletAddress);
      const tokenAccount = new PublicKey(tokenObj?.tokenContractAddress);
      const connection = getProvider(tokenObj);
      const info = await connection.getParsedTokenAccountsByOwner(
        ownerAccount,
        {
          mint: tokenAccount,
        },
      );
      return info.value[0].account.data.parsed.info.tokenAmount.uiAmountString;
    } catch (error) {
      return 0;
    }
  };

  /**
   * Fetches token information from the Solana network.
   * @param tokenObj An object representing the existing network and related information.
   * @returns A promise that resolves to the Solana token list response root.
   */
  const fetchTokenInfo = async (
    tokenObj: Pick<
      ExistingNetworksItem,
      | 'providerNetworkRPC_URL'
      | 'tokenContractAddress'
      | 'providerNetworkRPC_Network_Name'
      | 'networkName'
    >,
  ): Promise<SolanaTokenListResponseRoot> => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const response = await useAxios<SolanaTokenListResponseRoot>({
      axiosParams: {
        method: 'post',
        url: `https://token-list-api.solana.cloud/v1/mints?chainId=${tokenObj.providerNetworkRPC_Network_Name}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: { addresses: [tokenObj.tokenContractAddress] },
      },
    });
    return response;
  };

  /**
   * Associates a custom Solana token with a user's wallet.
   * @param tokenObj An object representing the existing network and related information.
   * @param toPubkey The public key of the destination wallet.
   * @returns A promise that resolves to the associated account.
   */
  const associateSolanaCustomTokenWithUserWallet = async (
    tokenObj: Pick<
      ExistingNetworksItem,
      | 'providerNetworkRPC_URL'
      | 'tokenContractAddress'
      | 'providerNetworkRPC_Network_Name'
      | 'networkName'
    >,
    toPubkey: PublicKey,
  ): Promise<Account> => {
    const connection = getProvider(tokenObj);
    const signer = await WalletSigner().signWallet(tokenObj);

    const FROM_KEYPAIR = Keypair.fromSecretKey(signer?.secretKey);
    const mintPubkey = new PublicKey(tokenObj.tokenContractAddress);
    const account = await getOrCreateAssociatedTokenAccount(
      connection,
      FROM_KEYPAIR,
      mintPubkey,
      toPubkey,
    );
    return account;
  };

  /**
   * Sends a Solana custom token to a specified address.
   * @param toAddress The address to send the token to.
   * @param amount The amount of the token to send.
   * @param gasPrice The price of gas.
   * @param gasLimit The gas limit.
   * @param onTransactionRequest A function to handle transaction requests.
   * @param onTransactionDone A function to handle successful transactions.
   * @param onTransactionFail A function to handle failed transactions.
   * @param tokenObj An object representing the existing network and related information.
   */
  const sendCustomToken = async (
    toAddress: string,
    amount: string,
    gasPrice: number,
    gasLimit: number,
    onTransactionRequest: (request?: {}) => void,
    onTransactionDone: (transaction: {}) => void,
    onTransactionFail: (transaction: {}) => void,
    tokenObj: ExistingNetworksItem,
  ) => {
    try {
      const connection = getProvider(tokenObj);
      const toPubkey = new PublicKey(toAddress);

      const signer = await WalletSigner().signWallet(tokenObj);

      const FROM_KEYPAIR = Keypair.fromSecretKey(signer?.secretKey);
      const sourceAccount = await associateSolanaCustomTokenWithUserWallet(
        tokenObj,
        FROM_KEYPAIR.publicKey,
      );
      const destinationAccount = await associateSolanaCustomTokenWithUserWallet(
        tokenObj,
        toPubkey,
      );

      const tx = new Transaction();

      const { decimals } = await getCustomTokenInformation(
        tokenObj.tokenContractAddress,
        tokenObj,
      );

      const mintPubkey = new PublicKey(tokenObj.tokenContractAddress);
      tx.feePayer = FROM_KEYPAIR.publicKey;
      const recentBlockhash = await connection.getLatestBlockhash();
      tx.recentBlockhash = recentBlockhash.blockhash;
      const fees = await tx.getEstimatedFee(connection);
      const PRIORITY_GAS_PRICE = gasPrice - (fees ?? 0);
      const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: PRIORITY_GAS_PRICE,
      });

      tx.add(PRIORITY_FEE_IX).add(
        createTransferCheckedInstruction(
          sourceAccount.address,
          mintPubkey,
          destinationAccount.address,
          FROM_KEYPAIR.publicKey,
          Number(amount) * Math.pow(10, decimals),
          decimals,
        ),
      );

      onTransactionRequest({ gasPrice: 0 });

      const confirmedTransaction = await sendAndConfirmTransaction(
        connection,
        tx,
        [FROM_KEYPAIR],
      );

      if (confirmedTransaction) {
        onTransactionDone({
          gasPrice: gasPrice,
          hash: confirmedTransaction,
          status: '1',
        });
        WalletCommonService().getBalanceAfterTransaction(tokenObj);
      } else {
        onTransactionFail(
          t('onBoarding:something_went_wrong_please_try_again'),
        );
      }
    } catch (error: any) {
      console.log('error/>>?>>>?????1', error);
      onTransactionFail(t('onBoarding:something_went_wrong_please_try_again'));
    }
  };

  /**
   * Retrieves the balance of a Solana custom token.
   * @param item An array of objects representing the existing network and related information.
   */
  const getSolanaCustomTokenBalance = async (item: ExistingNetworksItem[]) => {
    try {
      const connection = getProvider(item[0]);

      const walletAddress = getWalletAddress(
        item[0]?.networkName,
        item[0]?.isEVMNetwork,
      );

      const allTokenBalanceFormattedObjArray: {
        tokenBalance: any;
        tokenName: string;
      }[] = [];
      const tokenAmount = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(walletAddress),
        {
          programId: TOKEN_PROGRAM_ID,
        },
        'processed',
      );

      // Create an object to store the flattened data
      const flattenedData: {
        [mint: string]: {
          pubkey: PublicKey;
          account: AccountInfo<ParsedAccountData>;
        };
      } = {};

      const valueArray = tokenAmount;
      // Iterate through the "value" array and flatten it by the "mint" key
      for (const tokenAmountValue of valueArray.value) {
        const mint = tokenAmountValue.account.data.parsed.info.mint;
        flattenedData[mint] = tokenAmountValue;
      }

      item.forEach(tokenObject => {
        if (flattenedData[tokenObject?.tokenContractAddress ?? '']) {
          const tokenBalance =
            flattenedData[tokenObject?.tokenContractAddress ?? ''].account.data
              .parsed.info.tokenAmount.uiAmountString;

          allTokenBalanceFormattedObjArray.push({
            tokenBalance: tokenBalance,
            tokenName: tokenObject.shortName,
          });
        }
      });

      StoreUpdateReduxWalletStateService().updateMultipleTokenBalanceInStore(
        allTokenBalanceFormattedObjArray,
      );
    } catch (error) {
      console.log('SolanaService ===> error??>LLL', error);
    }
  };

  /**
   * Retrieves fee data for a transaction on the Solana network.
   * @param tokenObj An object containing information about the existing network.
   * @returns An object with gas fee data including gas price, max fee per gas, and max priority fee per gas.
   */
  const getFeeData = async (
    tokenObj: ExistingNetworksItem,
  ): Promise<GasFeeData> => {
    const connection = getProvider(tokenObj);
    const address = getWalletAddress(
      tokenObj?.networkName,
      tokenObj?.isEVMNetwork,
    );

    const fromPubkey = new PublicKey(address ?? '');
    const transaction = new solanaWeb3.Transaction();
    const recentBlockhash = await connection.getLatestBlockhash();
    transaction.feePayer = fromPubkey;
    transaction.recentBlockhash = recentBlockhash.blockhash;

    const fees = await transaction.getEstimatedFee(connection);

    return {
      gasPrice: fees,
      maxFeePerGas: '',
      maxPriorityFeePerGas: '',
    };
  };

  /**
   * Retrieves a list of token activities by wallet address.
   * @param walletAddress The address of the wallet.
   * @param txtType The type of token.
   * @param tokenInfo Information about the token.
   * @param page The page number for pagination.
   * @returns A promise that resolves to an array of token activities and a boolean indicating if it's a native token.
   */
  const getTokenActivityListByAddress = async ({
    walletAddress,
    txtType,
    tokenInfo,
    page,
  }: ActivityRequestType): Promise<any> => {
    if (page === 1) {
      if (txtType === NetWorkType.SOL) {
        try {
          const connection = getProvider(tokenInfo);
          const fromPubkey = new PublicKey(walletAddress);
          const options = {
            limit: PAGINATION_COUNT_20,
            // before: hash ? hash : null,
          };
          const allSignaturesData = await connection.getSignaturesForAddress(
            fromPubkey,
            options,
          );

          if (allSignaturesData?.length === 0) {
            return;
          }

          const signatures = allSignaturesData.map(obj => obj.signature);

          const transaction = await connection.getParsedTransactions(
            signatures,
          );

          let transactionBlocks = [];

          for (const obj of transaction) {
            if (
              obj?.meta?.preBalances?.length &&
              obj?.meta?.preBalances?.length > 0 &&
              obj?.meta?.postBalances?.length &&
              obj?.meta?.postBalances?.length > 0
            ) {
              const instructionObj =
                obj?.transaction?.message?.instructions?.filter(
                  item => item?.parsed?.type === 'transfer',
                )[0];
              const tx: ActivityItemInterface = {
                blockHash: '',
                blockNumber: '',
                confirmations: '',
                contractAddress: '',
                cumulativeGasUsed: '',
                from: instructionObj?.parsed?.info?.source ?? '',
                functionName:
                  instructionObj?.program === 'system' ? '' : 'customToken',
                gas: '',
                gasPrice: obj?.meta?.fee ?? '0',
                gasUsed: '',
                hash: obj?.transaction?.signatures[0],
                input: '',
                isError: '',
                methodId: '',
                nonce: '',
                timeStamp: obj?.blockTime?.toString() ?? '',
                to: instructionObj?.parsed?.info?.destination ?? '',
                transactionIndex: '',
                txreceipt_status: '1',
                value: (
                  obj?.meta?.preBalances[0] -
                  obj?.meta?.postBalances[0] -
                  obj?.meta?.fee
                )?.toString(),
                tokenDecimal: '9',
                tokenName: '',
                tokenSymbol: '',
              };
              transactionBlocks.push(tx);
            }
          }
          return { data: transactionBlocks, isNativeToken: true };
        } catch (error) {
          console.log('transactionBlocks error', error);
          return { data: [], isNativeToken: true };
        }
      } else {
        try {
          const connection = getProvider(tokenInfo);

          const mint = new PublicKey(tokenInfo?.tokenContractAddress);
          const owner = new PublicKey(walletAddress);

          const tokenAddress = await getAssociatedTokenAddress(mint, owner);
          const mintTokenAccountAddress = new PublicKey(tokenAddress);

          const options = {
            limit: PAGINATION_COUNT_20,
            // before: hash ? hash : null,
          };

          const sigs = await connection.getConfirmedSignaturesForAddress2(
            mintTokenAccountAddress,
            options,
          );

          if (sigs?.length === 0) {
            return;
          }
          const transaction = await connection.getParsedTransactions(
            sigs.map(i => i.signature),
          );

          let transactionBlocks = [];

          for (const obj of transaction) {
            if (
              obj?.meta?.preTokenBalances?.length &&
              obj?.meta?.preTokenBalances?.length > 0 &&
              obj?.meta?.postTokenBalances?.length &&
              obj?.meta?.postTokenBalances?.length > 0
            ) {
              const instructionObj =
                obj?.transaction?.message.instructions?.filter(
                  item => item?.parsed?.type === 'transferChecked',
                )[0];
              const toAddress =
                obj?.meta?.preTokenBalances?.filter(
                  item => item.owner !== instructionObj?.info?.authority,
                )[0]?.owner ?? instructionObj?.parsed?.info?.authority;
              const tx: ActivityItemInterface = {
                blockHash: '',
                blockNumber: '',
                confirmations: '',
                contractAddress: '',
                cumulativeGasUsed: '',
                from: instructionObj?.parsed?.info?.authority ?? '',
                functionName: '',
                gas: '',
                gasPrice: obj?.meta?.fee ?? '0',
                gasUsed: '',
                hash: obj?.transaction?.signatures[0],
                input: '',
                isError: '',
                methodId: '',
                nonce: '',
                timeStamp: obj?.blockTime?.toString() ?? '',
                to: toAddress,
                transactionIndex: '',
                txreceipt_status: '1',
                value: Math.abs(
                  (Number(
                    obj?.meta?.preTokenBalances[0]?.uiTokenAmount?.amount,
                  ) ?? 0) -
                    (Number(
                      obj?.meta?.postTokenBalances[0]?.uiTokenAmount?.amount,
                    ) ?? 0),
                )?.toString(),
                tokenDecimal: (
                  obj?.meta?.preTokenBalances[0]?.uiTokenAmount?.decimals ?? 0
                ).toString(),
                tokenName: '',
                tokenSymbol: '',
              };
              transactionBlocks.push(tx);
            }
          }
          return { data: transactionBlocks, isNativeToken: false };
        } catch (error) {
          console.log('transactionBlocks error', error);
          return { data: [], isNativeToken: true };
        }
      }
    } else {
      return { data: [], isNativeToken: true };
    }
  };

  /**
   * Retrieves transaction details for a specific token.
   * @param txtType The type of token.
   * @param tokenInfo Information about the token.
   * @param hash The hash of the transaction.
   * @returns A promise that resolves to an array of transaction details.
   */
  async function getTokenTransactionDetails({
    txtType,
    tokenInfo,
    hash,
  }: ActivityRequestType): Promise<any> {
    const connection = getProvider(tokenInfo);

    if (txtType === NetWorkType.SOL) {
      try {
        const transaction = await connection.getParsedTransaction(hash);
        if (
          transaction?.meta?.preBalances?.length &&
          transaction?.meta?.preBalances?.length > 0 &&
          transaction?.meta?.postBalances?.length &&
          transaction?.meta?.postBalances?.length > 0
        ) {
          const instructionObj =
            transaction?.transaction?.message.instructions?.filter(
              item => item?.parsed?.type === 'transfer',
            )[0];

          const tx: ActivityItemInterface = {
            blockHash: '',
            blockNumber: '',
            confirmations: '',
            contractAddress: '',
            cumulativeGasUsed: '',
            from: instructionObj?.parsed?.info?.source ?? '',
            functionName: '',
            gas: '',
            gasPrice: transaction?.meta?.fee ?? '0',
            gasUsed: '',
            hash: transaction?.transaction?.signatures[0],
            input: '',
            isError: '',
            methodId: '',
            nonce: '',
            timeStamp: transaction?.blockTime?.toString() ?? '',
            to: instructionObj?.parsed?.info?.destination ?? '',
            transactionIndex: '',
            txreceipt_status: '1',
            value: (
              transaction?.meta?.preBalances[0] -
              transaction?.meta?.postBalances[0] -
              transaction?.meta?.fee
            )?.toString(),
            tokenDecimal: '9',
            tokenName: '',
            tokenSymbol: '',
          };
          return [tx];
        } else {
          return [];
        }
      } catch (error) {
        console.log('error', error);
        return [];
      }
    } else {
      const transaction = await connection.getParsedTransaction(hash);

      if (
        transaction?.meta?.preTokenBalances?.length &&
        transaction?.meta?.preTokenBalances?.length > 0 &&
        transaction?.meta?.postTokenBalances?.length &&
        transaction?.meta?.postTokenBalances?.length > 0
      ) {
        try {
          const instructionObj = findValueByKey(transaction, 'parsed');
          const toAddress =
            transaction?.meta?.preTokenBalances?.filter(
              item => item.owner !== instructionObj?.info?.authority,
            )[0]?.owner ?? instructionObj?.info?.authority;
          const tx: ActivityItemInterface = {
            blockHash: '',
            blockNumber: '',
            confirmations: '',
            contractAddress: '',
            cumulativeGasUsed: '',
            from: instructionObj?.info?.authority ?? '',
            functionName: '',
            gas: '',
            gasPrice: transaction?.meta?.fee ?? '0',
            gasUsed: '',
            hash: transaction?.transaction?.signatures[0],
            input: '',
            isError: '',
            methodId: '',
            nonce: '',
            timeStamp: transaction?.blockTime?.toString() ?? '',
            to: toAddress,
            transactionIndex: '',
            txreceipt_status: '1',
            value: Math.abs(
              (Number(
                transaction?.meta?.preTokenBalances[0]?.uiTokenAmount?.amount,
              ) ?? 0) -
                (Number(
                  transaction?.meta?.postTokenBalances[0]?.uiTokenAmount
                    ?.amount,
                ) ?? 0),
            )?.toString(),
            tokenDecimal: (
              transaction?.meta?.preTokenBalances[0]?.uiTokenAmount?.decimals ??
              0
            ).toString(),
            tokenName: '',
            tokenSymbol: '',
          };
          return [tx];
        } catch (error) {
          console.log('error', error);
          return [];
        }
      }
    }
  }

  /**
   * Function to reset the wallet by setting the cachedWallet to null.
   */
  const resetWallet = () => {
    cachedWallet = null;
  };

  const getPrivateKeyUsingSeedPhrase = (pathIndex: string = '0') => {
    const seed = Bip39Manager().getSeedUsingMnemonic(
      store.getState().wallet.data.seedPhrase,
    );
    const hd = HDKey.fromMasterSeed(seed.toString('hex'));
    const derivationPath = `m/44'/501'/0'/${pathIndex}'`;
    const keypair = Keypair.fromSeed(hd.derive(derivationPath).privateKey);
    const secretKey = keypair.secretKey;
    const privateKey = encodeBase58(secretKey);

    return privateKey;
  };

  return {
    getWalletUsingSeed,
    getBalance,
    getProvider,
    sendNativeToken,
    getFeeData,
    getTokenActivityListByAddress,
    getTokenTransactionDetails,
    getCustomTokenInformation,
    sendCustomToken,
    associateSolanaCustomTokenWithUserWallet,
    getSolanaCustomTokenBalance,
    addEventListener,
    removeEventListeners,
    addSolanaNativeTokenListener,
    removeSolanaNativeTokenEventListeners,
    getWalletUsingPrivateKey,
    resetWallet,
    getPrivateKeyUsingSeedPhrase,
  };
};

export default SolanaService;
