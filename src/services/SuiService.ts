import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { t } from 'i18next';
import { store } from 'store/index';
import {
  formatErc20Token,
  formatErc20TokenConvertNormal,
  getWalletAddress,
  showToast,
} from 'theme/Helper/common/Function';
import { NetWorkType, PAGINATION_COUNT_20 } from 'theme/Helper/constant';
import {
  ActivityItemInterface,
  ExistingNetworksItem,
} from 'types/apiResponseInterfaces';
import {
  ActivityRequestType,
  CustomTokenInfo,
  GasFeeData,
} from 'types/applicationInterfaces';

import StoreUpdateReduxWalletStateService from './StoreUpdateReduxWalletStateService';
import { SuiTxBlock } from './SuiKit';
import WalletCommonService from './WalletCommonService';
import WalletSigner from './WalletSigner';

let cachedWallet: any;

const SuiService = () => {
  /**
   * Function to get the wallet using a seed mnemonic for SUI.
   * @param {string} mnemonic - The seed mnemonic used for wallet derivation.
   * @returns {Promise<{ address: string, privateKey: string }>} - Returns a promise that resolves to an object containing the SUI wallet address and private key.
   */
  const getWalletUsingSeed = async (
    mnemonic: string,
    pathIndex: string = '0',
  ) => {
    try {
      if (cachedWallet) {
        return cachedWallet;
      }

      const derivationPath = `m/44'/784'/0'/0'/${pathIndex}'`;
      // Derive keypair using the provided mnemonic
      const keypair = Ed25519Keypair.deriveKeypair(mnemonic, derivationPath);

      // Get the SUI address and private key in both base64 and hex formats
      const suiAddress = keypair.getPublicKey().toSuiAddress();
      const privateKey = keypair.export().privateKey;
      const strBase64 = Buffer.from(privateKey, 'base64');
      const privateKeyHex = strBase64.toString('hex');

      // Return an object containing the SUI address and private key
      cachedWallet = { address: suiAddress, privateKey: privateKeyHex };
      return cachedWallet;
    } catch (error: any) {
      // Display an error toast and log the error if it occurs during the wallet fetch process
      showToast('error', t('common:something_went_wrong_please_try_again'));
      console.log('Failed to fetch wallet SuiService: ' + error.message);
    }
  };

  /**
   * Function to get the wallet using a private key for SUI.
   * @param {string} privateKey - The private key used for wallet derivation.
   * @returns {string} - Returns the SUI wallet address.
   */
  const getWalletUsingPrivateKey = (privateKey: string) => {
    try {
      const privateKeyBytesLength = new TextEncoder().encode(privateKey).length;

      if (privateKeyBytesLength !== 64) {
        throw 'invalid key';
      }
      // Convert the hex private key to a Uint8Array
      const strBase64 = Buffer.from(privateKey, 'hex');
      const secretKey = new Uint8Array(strBase64);

      // Create a keypair using the secret key
      const keypair = Ed25519Keypair.fromSecretKey(secretKey);
      const suiAddress = keypair.getPublicKey().toSuiAddress();

      // Return the SUI wallet address
      return suiAddress;
    } catch (error: any) {
      // Display an error toast and log the error if it occurs during the wallet fetch process
      showToast('error', t('onBoarding:invalid_private_key'));
      console.log('getWalletUsingPrivateKey error: ' + error.message);
      return '';
    }
  };

  /**
   * Function to get the keypair using either a seed phrase or a private key.
   * @returns {Ed25519Keypair} - Returns the Ed25519 keypair.
   */
  const getKeypairUsingSeed = (pathIndex: string = '0') => {
    if (store.getState().userInfo.data.currentUser.isWalletFromSeedPhase) {
      const derivationPath = `m/44'/784'/0'/0'/${pathIndex}'`;

      // Derive the keypair using the seed phrase from the store
      const keypair = Ed25519Keypair.deriveKeypair(
        store.getState().wallet.data.seedPhrase,
        derivationPath,
      );
      return keypair;
    } else {
      // Convert the hex private key to a Uint8Array
      const strBase64 = Buffer.from(
        store.getState().userInfo.data.currentUser.privateKey,
        'hex',
      );
      const secretKey = new Uint8Array(strBase64);

      // Create a keypair using the secret key
      const keypair = Ed25519Keypair.fromSecretKey(secretKey);
      return keypair;
    }
  };

  /**
   * Function to get the SUI client provider for a given network item.
   * @param {ExistingNetworksItem} item - The network item containing the provider network RPC URL.
   * @returns {SuiClient} - Returns the SUI client for the specified network.
   */
  const getProvider = (item: ExistingNetworksItem) => {
    // Create a new SUI client using the provided URL from the network item
    const client = new SuiClient({
      url: item?.providerNetworkRPC_URL,
    });

    return client;
  };

  /**
   * Function to get the decimals for a specific coin type from the given token object.
   * @param {string} coinType - The type of coin for which to retrieve the decimals.
   * @param {ExistingNetworksItem} tokenObj - The existing network item containing the necessary token information.
   * @returns {Promise<number>} - Returns a promise that resolves to the number of decimals for the specified coin type.
   */
  const getDecimals = async (
    coinType: string,
    tokenObj: ExistingNetworksItem,
  ): Promise<number> => {
    try {
      // Retrieve the decimals using the SUI client from the token object
      const decimals = await getProvider(tokenObj).getCoinMetadata({
        coinType: coinType,
      });

      // Return the retrieved decimals if available, otherwise default to 9
      return decimals?.decimals ?? 9;
    } catch (error: any) {
      // Log an error message if there is an issue fetching the balance and default to 9
      console.log('Failed to getDecimals SUI: ' + error.message);
      return 9;
    }
  };

  /**
   * Function to get the balance for a specific address from the provided token object.
   * @param {string} address - The address for which to retrieve the balance.
   * @param {ExistingNetworksItem} tokenObj - The existing network item containing the necessary token information.
   */
  const getBalance = async (
    address: string,
    tokenObj: ExistingNetworksItem,
  ) => {
    try {
      // Get the SUI provider using the token object
      const suiProvider = getProvider(tokenObj);

      // Fetch the balance for the provided address using the SUI provider
      const fetchAllTokenBalance = await suiProvider.getBalance({
        owner: address,
      });

      const currentUserWalletAddress = getWalletAddress(
        tokenObj.networkName,
        tokenObj.isEVMNetwork,
      );
      if (currentUserWalletAddress === address) {
        return fetchAllTokenBalance;
      }
    } catch (error: any) {
      // Log an error message if there is an issue fetching the balance
      console.log('Failed to fetch balance SUI: ' + error.message);
    }
  };

  /**
   * Function to send SUI tokens to a specified address.
   * @param {string} toAddress - The recipient's address.
   * @param {string} amount - The amount of SUI tokens to send.
   * @param {number} gasPrice - The gas price for the transaction.
   * @param {number} gasLimit - The gas limit for the transaction.
   * @param {Function} onTransactionRequest - Function to handle the transaction request.
   * @param {Function} onTransactionDone - Function to handle the successful transaction.
   * @param {Function} onTransactionFail - Function to handle the failed transaction.
   * @param {ExistingNetworksItem} tokenObj - The existing network item containing the necessary token information.
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
      // Get the SUI provider using the token object
      const suiProvider = getProvider(tokenObj);

      // Fetch the reference gas price from the SUI provider
      const gasFees = await suiProvider.getReferenceGasPrice();

      // Create a new TransactionBlock
      const tx = new TransactionBlock();

      // Format the token amount and split coins for the transaction
      const txAmount = formatErc20TokenConvertNormal(Number(amount), 9);
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(txAmount)]);
      tx.setGasPrice(gasPrice);
      // Transfer the coins to the specified address
      tx.transferObjects([coin], tx.pure(toAddress));

      // Handle the transaction request
      onTransactionRequest({});

      // Sign and send the transaction, handle the result accordingly
      const result = await signAndSendTxn(tx, tokenObj);
      if (result) {
        onTransactionDone({
          gasPrice: gasFees.toString(),
          hash: result,
          status: '1',
        });
        WalletCommonService().getBalanceAfterTransaction(tokenObj);
      } else {
        onTransactionFail(
          t('onBoarding:something_went_wrong_please_try_again'),
        );
      }
    } catch (error: any) {
      // Log the error and handle the transaction failure
      console.log('error/>>?>>>?????', error);
      onTransactionFail(t('onBoarding:something_went_wrong_please_try_again'));
    }
  };

  /**
   * Function to send SUI custom tokens to a specified address.
   * @param {string} toAddress - The recipient's address.
   * @param {string} amount - The amount of SUI tokens to send.
   * @param {number} gasPrice - The gas price for the transaction.
   * @param {number} gasLimit - The gas limit for the transaction.
   * @param {Function} onTransactionRequest - Function to handle the transaction request.
   * @param {Function} onTransactionDone - Function to handle the successful transaction.
   * @param {Function} onTransactionFail - Function to handle the failed transaction.
   * @param {ExistingNetworksItem} tokenObj - The existing network item containing the necessary token information.
   */
  const sendCustomToken = async (
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
      // Get the SUI provider using the token object
      const suiProvider = getProvider(tokenObj);

      // Fetch the reference gas price from the SUI provider
      const gasFees = await suiProvider.getReferenceGasPrice();

      // Handle the transaction request
      onTransactionRequest({});

      // Format the token amount
      const txAmount = formatErc20TokenConvertNormal(Number(amount), 9);

      // Transfer the specified amount of coins to the provided address
      const result = await transferCoinToMany(
        [toAddress],
        [txAmount],
        tokenObj.tokenContractAddress,
        tokenObj,
        gasPrice,
      );

      // Handle the transaction result accordingly
      if (result) {
        onTransactionDone({
          gasPrice: gasFees.toString(),
          hash: result,
          status: '1',
        });
        WalletCommonService().getBalanceAfterTransaction(tokenObj);
      } else {
        onTransactionFail(
          t('onBoarding:something_went_wrong_please_try_again'),
        );
      }
    } catch (error: any) {
      // Log the error and handle the transaction failure
      console.log('error/>>?>>>?????', error);
      onTransactionFail(t('onBoarding:something_went_wrong_please_try_again'));
    }
  };

  /**
   * Transfer coins to multiple recipients.
   * @param {string[]} recipients - Array of recipient addresses.
   * @param {number[]} amounts - Array of amounts to be sent to each recipient.
   * @param {string} coinType - The type of the coin.
   * @param {ExistingNetworksItem} tokenObj - The existing network item containing the necessary token information.
   */
  const transferCoinToMany = async (
    recipients: string[],
    amounts: number[],
    coinType: string,
    tokenObj: ExistingNetworksItem,
    gasPrice: number,
  ) => {
    const tx = new SuiTxBlock();
    // Get the owner's wallet address based on the network information
    const ownerAddress = getWalletAddress(
      tokenObj?.networkName,
      tokenObj?.isEVMNetwork,
    );

    // Calculate the total amount to be transferred
    const totalAmount = amounts.reduce((a, b) => a + b, 0);

    // Select appropriate coins for the transaction
    const coins = await selectCoins(
      ownerAddress,
      totalAmount,
      coinType,
      tokenObj,
    );

    // Transfer coins to multiple recipients
    tx.transferCoinToMany(
      coins.map(c => c.objectId),
      ownerAddress,
      recipients,
      amounts,
    );
    tx.setGasPrice(gasPrice);

    // Sign and send the transaction and return the result
    return signAndSendTxn(tx, tokenObj);
  };

  /**
   * Sign and send a transaction.
   * @param {Uint8Array | TransactionBlock | SuiTxBlock} tx - The transaction data to be signed and sent.
   * @param {ExistingNetworksItem} tokenObj - The existing network item containing the necessary token information.
   * @returns {Promise<string>} - The digest of the signed and executed transaction.
   */
  const signAndSendTxn = async (
    tx: Uint8Array | TransactionBlock | SuiTxBlock,
    tokenObj: ExistingNetworksItem,
  ): Promise<string> => {
    // Get the SUI provider using the token object
    const suiProvider = getProvider(tokenObj);

    // Sign the wallet using the token object
    const signer = await WalletSigner().signWallet(tokenObj);

    // If signer is available, sign and execute the transaction block
    if (signer) {
      const result = await suiProvider.signAndExecuteTransactionBlock({
        signer: signer,
        transactionBlock: tx,
      });
      return result?.digest ?? '';
    } else {
      return '';
    }
  };

  /**
   * Select appropriate coins for a transaction based on the specified criteria.
   * @param {string} addr - The address for which the coins are selected.
   * @param {number} amount - The amount for which the coins are selected.
   * @param {string} coinType - The type of the coin. Default value is '0x2::SUI::SUI'.
   * @param {ExistingNetworksItem} tokenObj - The existing network item containing the necessary token information.
   * @returns {Promise<Array<{ objectId: string; digest: string; version: string; }>>} - An array of selected coins with their object IDs, digests, and versions.
   * @throws {Error} - Throws an error if no valid coins are found for the transaction.
   */
  const selectCoins = async (
    addr: string,
    amount: number,
    coinType: string = '0x2::SUI::SUI',
    tokenObj: ExistingNetworksItem,
  ) => {
    const suiProvider = getProvider(tokenObj);

    const selectedCoins: {
      objectId: string;
      digest: string;
      version: string;
    }[] = [];

    let totalAmount = 0;
    let hasNext = true,
      nextCursor: string | null | undefined = null;

    while (hasNext && totalAmount < amount) {
      const coins = await suiProvider.getCoins({
        owner: addr,
        coinType: coinType,
        cursor: nextCursor,
      });

      // Sort the coins by balance in descending order
      // eslint-disable-next-line radix
      coins.data.sort((a, b) => parseInt(b.balance) - parseInt(a.balance));

      for (const coinData of coins.data) {
        selectedCoins.push({
          objectId: coinData.coinObjectId,
          digest: coinData.digest,
          version: coinData.version,
        });
        // eslint-disable-next-line radix
        totalAmount = totalAmount + parseInt(coinData.balance);
        if (totalAmount >= amount) {
          break;
        }
      }

      nextCursor = coins.nextCursor;
      hasNext = coins.hasNextPage;
    }

    if (!selectedCoins.length) {
      throw new Error('No valid coins found for the transaction.');
    }

    return selectedCoins;
  };

  /**
   * Retrieve gas fee data for the specified token object.
   * @param {ExistingNetworksItem} tokenObj - The existing network item containing the necessary token information.
   * @returns {Promise<GasFeeData>} - The gas fee data including gas price, max fee per gas, max priority fee per gas, and gas used.
   */
  const getFeeData = async (
    tokenObj: ExistingNetworksItem,
  ): Promise<GasFeeData> => {
    const suiProvider = getProvider(tokenObj);
    const fees = await suiProvider.getReferenceGasPrice();

    return {
      gasPrice: fees.toString(),
      maxFeePerGas: '',
      maxPriorityFeePerGas: '',
      gasUsed: '',
    };
  };

  /**
   * Retrieve the list of token activities associated with the specified wallet address.
   * @param {ActivityRequestType} params - Object containing details such as wallet address, transaction type, page number, and token information.
   * @returns {Promise<any>} - Promise containing the list of transaction blocks and the associated token activities.
   */
  const getTokenActivityListByAddress = async ({
    walletAddress,
    txtType,
    page,
    tokenInfo,
  }: ActivityRequestType): Promise<any> => {
    if (page === 1) {
      try {
        const suiProvider = getProvider(tokenInfo);
        const fromTransactionBlocks = await suiProvider.queryTransactionBlocks({
          filter: {
            FromAddress: walletAddress,
          },
          options: {
            showBalanceChanges: true,
            showEffects: true,
            showInput: true,
          },
          limit: PAGINATION_COUNT_20,
        });

        const toTransactionBlocks = await suiProvider.queryTransactionBlocks({
          filter: {
            ToAddress: walletAddress,
          },
          options: {
            showBalanceChanges: true,
            showEffects: true,
            showInput: true,
          },
          limit: PAGINATION_COUNT_20,
        });

        let transactionList = fromTransactionBlocks.data;
        transactionList = transactionList.concat(toTransactionBlocks.data);

        let transactionBlocks = [];
        const seen = new Map();

        for (const obj of transactionList) {
          const digest = obj?.digest;

          if (obj?.balanceChanges?.length) {
            let toAddress = '';
            let functionName = '';
            let value = '';

            for (const balanceChange of obj?.balanceChanges) {
              if (
                balanceChange?.owner?.AddressOwner !==
                obj?.transaction?.data?.sender
              ) {
                toAddress = balanceChange?.owner?.AddressOwner ?? '';
                value = balanceChange?.amount ?? '0';

                if (txtType !== NetWorkType.SUI) {
                  if (
                    balanceChange?.coinType === tokenInfo.tokenContractAddress
                  ) {
                    functionName = balanceChange?.coinType ?? '';
                  }
                } else {
                  if (!balanceChange.coinType?.includes('sui::SUI')) {
                    functionName = balanceChange?.coinType ?? '';
                  }
                }
              }
            }

            if (!seen.has(digest)) {
              if (value) {
                const tx: ActivityItemInterface = {
                  blockHash: '',
                  blockNumber: '',
                  confirmations: '',
                  contractAddress: '',
                  cumulativeGasUsed: '',
                  from: obj?.transaction?.data?.sender ?? '',
                  functionName: functionName,
                  gas: '',
                  gasPrice: obj?.transaction?.data?.gasData?.price ?? '0',
                  gasUsed: '',
                  hash: digest,
                  input: '',
                  isError: '',
                  methodId: '',
                  nonce: '',
                  timeStamp: obj?.timestampMs
                    ? (Number(obj?.timestampMs ?? 0) / 1000).toString()
                    : undefined,
                  to: toAddress,
                  transactionIndex: '',
                  txreceipt_status:
                    obj?.effects?.status?.status === 'success' ? '1' : '3',
                  value: value,
                  tokenDecimal: '9',
                  tokenName: '',
                  tokenSymbol: '',
                };
                transactionBlocks.push(tx);
              }
            }
          }
          seen.set(digest, true);
        }

        transactionBlocks = transactionBlocks.sort(function (x, y) {
          return y.timeStamp - x.timeStamp;
        });

        transactionBlocks = transactionBlocks?.filter(function (item) {
          return txtType === NetWorkType.SUI
            ? item.functionName === ''
            : item.functionName !== '';
        });

        return {
          data: transactionBlocks,
          isNativeToken: txtType === NetWorkType.SUI ? true : false,
        };
      } catch (error) {
        console.log('transactionBlocks error', error);
        return { data: [], isNativeToken: true };
      }
    } else {
      return { data: [], isNativeToken: true };
    }
  };

  /**
   * Fetches details of a specific token transaction.
   * @param {ActivityRequestType} params - Object containing details such as token information and the transaction hash.
   * @returns {Promise<any>} - Promise containing the details of the token transaction.
   */
  async function getTokenTransactionDetails({
    tokenInfo,
    hash,
  }: ActivityRequestType): Promise<any> {
    const suiProvider = getProvider(tokenInfo);

    try {
      let transaction = await suiProvider.getTransactionBlock({
        digest: hash,
        options: {
          showBalanceChanges: true,
          showEffects: true,
          showInput: true,
        },
      });

      if (transaction?.digest) {
        let toAddress = '';
        let functionName = '';
        let value = '0';
        let garPrice = '0';

        const ownerAddress = getWalletAddress(
          tokenInfo?.networkName,
          tokenInfo?.isEVMNetwork,
        );

        const receiverBalanceChange = transaction?.balanceChanges?.filter(
          function (item) {
            return (
              item?.owner?.AddressOwner !==
              transaction?.transaction?.data?.sender
            );
          },
        );
        if (receiverBalanceChange?.length) {
          toAddress = receiverBalanceChange[0]?.owner?.AddressOwner ?? '';
          value = receiverBalanceChange[0]?.amount ?? '0';
          if (!receiverBalanceChange[0].coinType?.includes('sui::SUI')) {
            functionName = receiverBalanceChange[0].coinType;
          }
        }

        const ownerBalanceChange = transaction?.balanceChanges?.filter(
          function (item) {
            return item?.owner?.AddressOwner === ownerAddress;
          },
        );

        if (ownerBalanceChange?.length) {
          if (
            ownerBalanceChange[0]?.coinType?.includes('sui::SUI') &&
            parseFloat(ownerBalanceChange[0]?.amount) < 0
          ) {
            if (tokenInfo.tokenType === 'Native') {
              garPrice =
                parseFloat(ownerBalanceChange[0]?.amount) + parseFloat(value);
            } else {
              garPrice = ownerBalanceChange[0]?.amount;
            }
          }
        }

        const tx: ActivityItemInterface = {
          blockHash: '',
          blockNumber: '',
          confirmations: '',
          contractAddress: '',
          cumulativeGasUsed: '',
          from: transaction?.transaction?.data?.sender ?? '',
          functionName: functionName,
          gas: '',
          gasPrice: Math.abs(garPrice) + '',
          gasUsed: '',
          hash: hash,
          input: '',
          isError: '',
          methodId: '',
          nonce: '',
          timeStamp: transaction?.timestampMs
            ? (Number(transaction?.timestampMs ?? 0) / 1000).toString()
            : undefined,
          to: toAddress,
          transactionIndex: '',
          txreceipt_status:
            transaction?.effects?.status?.status === 'success' ? '1' : '3',
          value: value,
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
  }

  /**
   * Fetches token information based on the provided contract address.
   * @param {string} contractAddress - The contract address of the token.
   * @param {Pick<ExistingNetworksItem, 'providerNetworkRPC_URL' | 'tokenContractAddress' | 'providerNetworkRPC_Network_Name' | 'networkName'>} tokenObj - Object containing network-related information.
   * @returns {Promise<CustomTokenInfo | null>} - Promise containing the token information or null if not found.
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
  ): Promise<CustomTokenInfo | null> => {
    try {
      const suiProvider = getProvider(tokenObj);

      const tokenInfo = await suiProvider.getCoinMetadata({
        coinType: contractAddress,
      });
      if (!tokenInfo) {
        throw 'Invalid ContractAddress';
      }
      const balance = await getSuiCustomTokenBalance(
        [
          {
            ...tokenObj,
            ...{
              subTitle: tokenInfo?.name ?? '',
              tokenContractAddress: contractAddress,
            },
          },
        ],
        false,
      );
      return {
        decimals: tokenInfo?.decimals ?? '9',
        name: tokenInfo?.name ?? '',
        symbol: tokenInfo?.symbol ?? '',
        type: '',
        contractAddress: contractAddress,
        logoURI: tokenInfo?.iconUrl ?? '',
        balance: balance[0].tokenBalance,
      };
    } catch (error: any) {
      // showToast('error', t('common:something_went_wrong_please_try_again'));
      console.log('Failed to fetch token info: ' + error);
      throw new Error('Invalid Error');
    }
  };

  /**
   * Fetches SUI custom token balances for the specified items.
   * @param {ExistingNetworksItem[]} item - Array of network items.
   */
  const getSuiCustomTokenBalance = async (
    item: ExistingNetworksItem[],
    shouldStore = true,
  ) => {
    try {
      const suiProvider = getProvider(item[0]);

      const walletAddress = getWalletAddress(
        item[0]?.networkName,
        item[0]?.isEVMNetwork,
      );
      const allTokenBalanceFormattedObjArray: {
        tokenBalance: any;
        tokenName: string;
      }[] = [];

      for (const tokenObject of item) {
        const tokenInfo = await suiProvider.getCoinMetadata({
          coinType: tokenObject.tokenContractAddress,
        });

        const tokenBalance = await suiProvider.getBalance({
          owner: walletAddress,
          coinType: tokenObject.tokenContractAddress,
        });

        const formattedBalance = formatErc20Token(
          tokenBalance?.totalBalance ?? '0',
          Number(tokenInfo?.decimals ?? 9),
        );

        allTokenBalanceFormattedObjArray.push({
          tokenBalance: formattedBalance,
          tokenName: shouldStore
            ? tokenObject.shortName
            : tokenObject.tokenContractAddress ?? '',
        });
      }

      if (shouldStore) {
        StoreUpdateReduxWalletStateService().updateMultipleTokenBalanceInStore(
          allTokenBalanceFormattedObjArray,
        );
      } else {
        //Note: for this case passed token address in tokenName key
        return allTokenBalanceFormattedObjArray;
      }
    } catch (error) {
      console.log('SuiService ==> error??>LLL', error);
    }
  };

  /**
   * Function to reset the wallet by setting the cachedWallet to null.
   */
  const resetWallet = () => {
    cachedWallet = null;
  };

  const getPrivateKeyUsingSeedPhrase = (pathIndex: string = '0') => {
    const derivationPath = `m/44'/784'/0'/0'/${pathIndex}'`;
    // Derive keypair using the provided mnemonic
    const keypair = Ed25519Keypair.deriveKeypair(
      store.getState().wallet.data.seedPhrase,
      derivationPath,
    );

    // Get the private key in both base64 and hex formats
    const privateKey = keypair.export().privateKey;
    const strBase64 = Buffer.from(privateKey, 'base64');
    const privateKeyHex = strBase64.toString('hex');
    return privateKeyHex;
  };

  return {
    getWalletUsingSeed,
    getBalance,
    getDecimals,
    getFeeData,
    sendNativeToken,
    getKeypairUsingSeed,
    getProvider,
    getTokenActivityListByAddress,
    getTokenTransactionDetails,
    getCustomTokenInformation,
    getSuiCustomTokenBalance,
    sendCustomToken,
    getWalletUsingPrivateKey,
    transferCoinToMany,
    selectCoins,
    signAndSendTxn,
    resetWallet,
    getPrivateKeyUsingSeedPhrase,
  };
};

export default SuiService;
