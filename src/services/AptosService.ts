import {
  APTOS_COIN,
  AptosAccount,
  AptosClient,
  CoinClient,
  HexString,
  IndexerClient,
  TRANSFER_COINS,
  TransactionBuilderRemoteABI,
} from 'aptos';
import { t } from 'i18next';
import nextFrame from 'next-frame';
import { store } from 'store/index';
import {
  formatErc20Token,
  formatErc20TokenConvertNormal,
  getWalletAddress,
  showToast,
} from 'theme/Helper/common/Function';
import {
  Aptos_CoinStore,
  Aptos_Coin_Register,
  NetWorkType,
  PAGINATION_COUNT_20,
} from 'theme/Helper/constant';
import {
  ActivityItemInterface,
  ExistingNetworksItem,
} from 'types/apiResponseInterfaces';
import {
  ActivityRequestType,
  CustomTokenInfo,
  GasFeeData,
} from 'types/applicationInterfaces';

import { aptosErrorMessages } from '../theme/Helper/constant';
import StoreUpdateReduxWalletStateService from './StoreUpdateReduxWalletStateService';
import WalletCommonService from './WalletCommonService';

let cachedWallet: any;
let cachedClient: AptosClient;

const AptosService = () => {
  /**
   * Function to retrieve a wallet using a mnemonic seed.
   * @param {string} mnemonic - The mnemonic seed used to derive the wallet.
   * @returns {Promise<Object>} - Returns an object containing the wallet address and private key.
   */
  const getWalletUsingSeed = async (
    mnemonic: string,
    pathIndex: string = '0',
  ) => {
    try {
      if (cachedWallet) {
        return cachedWallet;
      }

      const derivationPath = `m/44'/637'/0'/0'/${pathIndex}'`;
      await nextFrame();

      const account = AptosAccount.fromDerivePath(derivationPath, mnemonic);
      const accountObj = account.toPrivateKeyObject();
      const aptosAddress = accountObj.address;
      const privateKey = accountObj.privateKeyHex?.toString();

      cachedWallet = { address: aptosAddress, privateKey };
      return cachedWallet;
    } catch (error) {
      // Display an error toast and log the error message if an error occurs
      showToast('error', t('common:something_went_wrong_please_try_again'));
      console.log('Failed to fetch wallet AptosService: ' + error.message);
    }
  };

  /**
   * Function to retrieve a wallet using a private key.
   * @param {string} privateKey - The private key used to derive the wallet.
   * @returns {string} - Returns the wallet address derived from the private key.
   */
  const getWalletUsingPrivateKey = (privateKey: string) => {
    try {
      // Convert the private key to bytes
      const privateKeyBytes = HexString.ensure(privateKey).toUint8Array();

      // Create an Aptos account using the provided private key bytes
      const account = new AptosAccount(privateKeyBytes);

      // Retrieve the wallet address from the account
      const aptosAddress = account.address().toString();

      return aptosAddress;
    } catch (error: any) {
      showToast('error', t('onBoarding:invalid_private_key'));
      console.log('getWalletUsingPrivateKey error: ' + error.message);
      return '';
    }
  };

  /**
   * Function to create a provider using the provided URL.
   * If the cached client node URL does not match the provided URL, a new AptosClient is created and cached.
   * @param {string} url - The URL used to create the provider.
   * @returns {AptosClient} - Returns the created or cached AptosClient.
   */
  const createProvider = (url: string) => {
    // Check if the cached client node URL matches the provided URL
    if (cachedClient?.nodeUrl !== url) {
      // If the URLs don't match, create a new AptosClient with the provided URL and cache it
      cachedClient = new AptosClient(url);
    }
    return cachedClient;
  };

  /**
   * Function to retrieve a provider based on the information from an ExistingNetworksItem.
   * The function uses the createProvider function to create or return a cached AptosClient based on the provided URL.
   * @param {ExistingNetworksItem} item - The item containing network information.
   * @returns {AptosClient} - Returns the created or cached AptosClient based on the provided network URL.
   */
  const getProvider = (item: ExistingNetworksItem) => {
    return createProvider(item?.providerNetworkRPC_URL);
  };

  /**
   * Function to retrieve the private key from the Redux store.
   * If the wallet is derived from a seed phase, it calls getWalletUsingSeed to retrieve the private key.
   * Otherwise, it retrieves the private key directly from the Redux store.
   * @returns {Promise<string>} - Returns the retrieved private key.
   */
  const getPrivateKey = async () => {
    // Check if the wallet is from the seed phase
    const { isWalletFromSeedPhase } =
      store.getState().userInfo.data.currentUser;

    if (isWalletFromSeedPhase) {
      // If the wallet is from the seed phase, retrieve the private key using getWalletUsingSeed
      const account = await getWalletUsingSeed(
        store.getState().wallet.data.seedPhrase,
        WalletCommonService().getDerivationPathIndex(NetWorkType.APT),
      );
      return account.privateKey;
    } else {
      // If the wallet is not from the seed phase, retrieve the private key from the Redux store
      return store.getState().userInfo.data.currentUser.privateKey || '';
    }
  };

  /**
   * Function to retrieve the balance for a specific token using the provided token object.
   * @param {ExistingNetworksItem} tokenObj - The object containing information about the token.
   * @returns {Promise<string>} - Returns a promise that resolves to the token balance as a string.
   */
  const getBalance = async (
    tokenObj: ExistingNetworksItem,
  ): Promise<string> => {
    try {
      const client = getProvider(tokenObj);
      const privateKey = await getPrivateKey();
      const privateKeyBytes = HexString.ensure(privateKey).toUint8Array();
      const myAccount = new AptosAccount(privateKeyBytes);
      const coinClient = new CoinClient(client);

      const bcsTxn = await coinClient.checkBalance(myAccount, {
        coinType: APTOS_COIN,
      });

      const currentUserWalletAddress = getWalletAddress(
        tokenObj.networkName,
        tokenObj.isEVMNetwork,
      );

      return currentUserWalletAddress === myAccount.address().toString()
        ? bcsTxn?.toString() ?? '0'
        : '0';
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  };

  /**
   * Function to retrieve the balance of another user using the provided address and token object.
   * @param {string} address - The address of the user whose balance is to be retrieved.
   * @param {ExistingNetworksItem} tokenObj - The object containing information about the token.
   * @returns {Promise<string>} - Returns a promise that resolves to the balance of the specified user as a string.
   */
  const getOtherUserBalance = async (
    address: string,
    tokenObj: ExistingNetworksItem,
  ): Promise<string> => {
    try {
      const client = getProvider(tokenObj);
      const resources = await client.getAccountResources(address);

      // Find the account resource with type Aptos_CoinStore
      const accountResource = resources.find(r => r.type === Aptos_CoinStore);

      // Use optional chaining to safely access nested property
      const balance = accountResource?.data?.coin?.value ?? '0';

      // Return the balance as a string
      return balance.toString();
    } catch (error) {
      console.error('Error fetching other user balance:', error);
      return '0';
    }
  };

  /**
   * Function to send Aptos coins to a specified address.
   * @param {string} toAddress - The recipient's address for the transaction.
   * @param {string} amount - The amount of Aptos coins to send.
   * @param {number} _gasPrice - The gas price for the transaction.
   * @param {number} _gasLimit - The gas limit for the transaction.
   * @param {Function} onTransactionRequest - Callback function executed when the transaction request is made.
   * @param {Function} onTransactionDone - Callback function executed when the transaction is successful.
   * @param {Function} onTransactionFail - Callback function executed when the transaction fails.
   * @param {ExistingNetworksItem} tokenObj - The object containing information about the token.
   */
  const sendNativeToken = async (
    toAddress: string,
    amount: string,
    gasPrice: number,
    _gasLimit: number,
    onTransactionRequest: (request?: {}) => void,
    onTransactionDone: (transaction: {}) => void,
    onTransactionFail: (error: string) => void,
    tokenObj: ExistingNetworksItem,
  ) => {
    try {
      const privateKey = await getPrivateKey();
      const privateKeyBytes = HexString.ensure(privateKey).toUint8Array();
      const myAccount = new AptosAccount(privateKeyBytes);
      const client = getProvider(tokenObj);
      const builder = new TransactionBuilderRemoteABI(client, {
        sender: myAccount.address(),
        gasUnitPrice: gasPrice ? Symbol(gasPrice).description : undefined,
      });

      const rawTxn = await builder.build(
        TRANSFER_COINS,
        [APTOS_COIN],
        [toAddress, formatErc20TokenConvertNormal(Number(amount), 8)],
      );

      const bcsTxn = AptosClient.generateBCSTransaction(myAccount, rawTxn);
      const pendingTransaction = await client.submitSignedBCSTransaction(
        bcsTxn,
      );

      onTransactionRequest({});

      const transactions = await client.waitForTransactionWithResult(
        pendingTransaction.hash,
      );

      if (transactions?.success) {
        onTransactionDone({
          gasPrice: transactions?.gas_unit_price,
          hash: transactions?.hash,
          status: '1',
          gasUsed: transactions?.gas_used,
        });

        WalletCommonService().getBalanceAfterTransaction(tokenObj);
      } else {
        console.error('Error in transactions aptos:', transactions);
        throw t('onBoarding:something_went_wrong_please_try_again');
      }
    } catch (error) {
      console.error('Error in sendAptos:', error);
      try {
        const errorMessageMatch = JSON.parse(
          error?.message ?? '{}',
        )?.message?.match(/Code: (\w+)/);

        const errorMessageCode = errorMessageMatch
          ? errorMessageMatch[1]
          : 'Unknown error';

        const errorMessage =
          aptosErrorMessages[errorMessageCode] || 'Unknown error';
        onTransactionFail(errorMessage);
      } catch {
        onTransactionFail('Unknown error');
      }
    }
  };

  /**
   * Function to send Aptos custom tokens to a specified address.
   * @param {string} toAddress - The recipient's address for the transaction.
   * @param {string} amount - The amount of Aptos tokens to send.
   * @param {number} _gasPrice - The gas price for the transaction.
   * @param {number} _gasLimit - The gas limit for the transaction.
   * @param {Function} onTransactionRequest - Callback function executed when the transaction request is made.
   * @param {Function} onTransactionDone - Callback function executed when the transaction is successful.
   * @param {Function} onTransactionFail - Callback function executed when the transaction fails.
   * @param {ExistingNetworksItem} tokenObj - The object containing information about the token.
   */
  const sendCustomToken = async (
    toAddress: string,
    amount: string,
    gasPrice: number,
    _gasLimit: number,
    onTransactionRequest: (request?: {}) => void,
    onTransactionDone: (transaction: {}) => void,
    onTransactionFail: (error: string) => void,
    tokenObj: ExistingNetworksItem,
  ) => {
    try {
      const walletAddress = getWalletAddress(tokenObj?.networkName);
      const privateKey = await getPrivateKey();
      const privateKeyBytes = HexString.ensure(privateKey).toUint8Array();
      const myAccount = new AptosAccount(privateKeyBytes);
      const client = getProvider(tokenObj);

      const builder = new TransactionBuilderRemoteABI(client, {
        sender: myAccount.address(),
        gasUnitPrice: gasPrice ? Symbol(gasPrice).description : undefined,
      });

      const contractInfo = await getCustomTokenInformation(
        tokenObj.tokenContractAddress,
        tokenObj,
      );

      await checkAndRegister(walletAddress, tokenObj);

      const rawTxn = await builder.build(
        TRANSFER_COINS,
        [tokenObj.tokenContractAddress],
        [
          toAddress,
          formatErc20TokenConvertNormal(
            Number(amount),
            Number(contractInfo.decimals),
          ),
        ],
      );

      const bcsTxn = AptosClient.generateBCSTransaction(myAccount, rawTxn);
      const pendingTransaction = await client.submitSignedBCSTransaction(
        bcsTxn,
      );

      onTransactionRequest({});

      const transactions = await client.waitForTransactionWithResult(
        pendingTransaction.hash,
      );

      if (transactions?.success) {
        onTransactionDone({
          gasPrice: transactions?.gas_unit_price,
          hash: transactions?.hash,
          status: '1',
          gasUsed: transactions?.gas_used,
        });

        WalletCommonService().getBalanceAfterTransaction(tokenObj);
      } else {
        console.error('Error in transactions sendCustomToken:', transactions);
        throw t('onBoarding:something_went_wrong_please_try_again');
      }
    } catch (error) {
      console.error('Error in sendCustomToken:', error);
      try {
        const errorMessageMatch = JSON.parse(
          error?.message ?? '{}',
        )?.message?.match(/Code: (\w+)/);

        const errorMessageCode = errorMessageMatch
          ? errorMessageMatch[1]
          : 'Unknown error';

        const errorMessage =
          aptosErrorMessages[errorMessageCode] || 'Unknown error';
        onTransactionFail(errorMessage);
      } catch {
        onTransactionFail('Unknown error');
      }
    }
  };

  /**
   * Function to retrieve gas fee data for transactions.
   * @param {ExistingNetworksItem} tokenObj - The object containing information about the token.
   * @returns {Promise<GasFeeData>} - Returns a promise that resolves to an object containing gas fee data.
   */
  const getFeeData = async (
    tokenObj: ExistingNetworksItem,
  ): Promise<GasFeeData> => {
    try {
      const client = getProvider(tokenObj);
      const gasObj = await client.estimateGasPrice();
      const gasFeeData: GasFeeData = gasObj
        ? {
            gasPrice: gasObj.gas_estimate,
            maxFeePerGas: '',
            maxPriorityFeePerGas: '',
            gasUsed: gasObj.gas_estimate,
          }
        : {
            gasPrice: 0,
            maxFeePerGas: 0,
            maxPriorityFeePerGas: 0,
            gasUsed: 0,
          };

      return gasFeeData;
    } catch (error) {
      console.error('Error in getFeeData:', error);
      throw {
        gasPrice: 0,
        maxFeePerGas: 0,
        maxPriorityFeePerGas: 0,
        gasUsed: 0,
      };
    }
  };

  /**
   * Function to retrieve the token activity list for a specific wallet address.
   * @param {ActivityRequestType} - An object containing the wallet address, transaction type, page, and token information.
   * @returns {Promise<any>} - Returns a promise that resolves to an object containing the token activity list.
   */
  const getTokenActivityListByAddress = async ({
    walletAddress,
    txtType,
    page,
    tokenInfo,
  }: ActivityRequestType): Promise<any> => {
    try {
      const client = getProvider(tokenInfo);
      const indexerClient = new IndexerClient(tokenInfo?.indexerClient ?? '');
      const transactionVersion = await indexerClient.getAccountTransactionsData(
        walletAddress,
        {
          options: {
            limit: PAGINATION_COUNT_20,
            offset: (page - 1) * PAGINATION_COUNT_20,
          },
          orderBy: [{ transaction_version: 'desc' }],
        },
      );

      const transactionBlocks = await Promise.all(
        transactionVersion.account_transactions.map(async version => {
          const transaction = await client.getTransactionByVersion(
            version.transaction_version,
          );

          if (
            !transaction?.payload?.function?.toLowerCase()?.includes('register')
          ) {
            const functionName = getTransactionFunctionName(
              transaction,
              tokenInfo,
            );

            const tx: ActivityItemInterface = {
              blockHash: '',
              blockNumber: '',
              confirmations: '',
              contractAddress: '',
              cumulativeGasUsed: '',
              from: transaction?.payload?.function
                ?.toLowerCase()
                ?.includes('mint')
                ? ''
                : transaction?.sender ?? '',
              functionName,
              gas: '',
              gasPrice: transaction?.gas_unit_price ?? '0',
              gasUsed: transaction?.gas_used ?? '0',
              hash: transaction?.hash,
              input: '',
              isError: '',
              methodId: '',
              nonce: '',
              timeStamp:
                (Number(transaction?.timestamp ?? 0) / 1000000)?.toString() ??
                '',
              to:
                transaction?.payload?.arguments?.length === 2
                  ? transaction?.payload?.arguments[0]
                  : '',
              transactionIndex: '',
              txreceipt_status: transaction?.success ? '1' : '3',
              value:
                transaction?.payload?.arguments?.length === 2
                  ? transaction?.sender === transaction?.payload?.arguments[0]
                    ? '0'
                    : transaction?.payload?.arguments[1]
                  : transaction?.payload?.arguments[0],
              tokenDecimal: '8',
              tokenName: '',
              tokenSymbol: '',
            };

            return tx;
          }

          return null;
        }),
      );

      // Filter out null values (transactions with 'register' function)
      const filteredTransactionBlocks = transactionBlocks.filter(
        tx => tx !== null,
      );

      // Filter the transaction blocks to retrieve native tokens based on the transaction type
      const nativeToken = filteredTransactionBlocks?.filter(item =>
        txtType === NetWorkType.APT
          ? item.functionName === ''
          : item.functionName !== '',
      );

      return {
        data: nativeToken,
        isNativeToken: txtType === NetWorkType.APT,
      };
    } catch (error) {
      console.error('Error in getTokenActivityListByAddress:', error);
      return { data: [], isNativeToken: true };
    }
  };

  /**
   * Function to retrieve token transaction details based on the transaction type and hash.
   * @param {ActivityRequestType} - An object containing the transaction type, token information, and hash.
   * @returns {Promise<any>} - Returns a promise that resolves to an array containing the transaction details.
   */
  async function getTokenTransactionDetails({
    _txtType,
    tokenInfo,
    hash,
  }: ActivityRequestType): Promise<ActivityItemInterface[]> {
    try {
      const client = getProvider(tokenInfo);
      const transaction = await client.getTransactionByHash(hash);

      const tx: ActivityItemInterface = {
        blockHash: '',
        blockNumber: '',
        confirmations: '',
        contractAddress: '',
        cumulativeGasUsed: '',
        from: getTransactionSender(transaction),
        functionName: getTransactionFunctionName(transaction, tokenInfo),
        gas: '',
        gasPrice: transaction?.gas_unit_price ?? '0',
        gasUsed: transaction?.gas_used ?? '0',
        hash: transaction?.hash,
        input: '',
        isError: '',
        methodId: '',
        nonce: '',
        timeStamp:
          (Number(transaction?.timestamp ?? 0) / 1000000)?.toString() ?? '',
        to: getTransactionToAddress(transaction),
        transactionIndex: '',
        txreceipt_status: transaction?.success ? '1' : '3',
        value: getTransactionValue(transaction),
        tokenDecimal: '8',
        tokenName: '',
        tokenSymbol: '',
      };

      return [tx];
    } catch (error) {
      console.error('Error in getTokenTransactionDetails:', error);
      return [];
    }
  }

  /**
   * Function to retrieve token information from a specific contract address.
   * @param {string} contractAddress - The contract address to retrieve token information from.
   * @param {Pick<ExistingNetworksItem, 'providerNetworkRPC_URL' | 'tokenContractAddress' | 'providerNetworkRPC_Network_Name' | 'networkName'>} tokenObj - An object containing the necessary token information.
   * @returns {Promise<CustomTokenInfo>} - Returns a promise that resolves to an object containing the token information.
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
    shouldFetchBalance = false,
  ): Promise<CustomTokenInfo> => {
    try {
      const client = getProvider(tokenObj);
      const coin = `0x1::coin::CoinInfo<${contractAddress}>`;
      const addressArray = contractAddress.split('::');
      if (addressArray.length < 3) {
        throw 'Invalid ContractAddress';
      }
      const newContractAddress = addressArray[0] ?? '';
      // Get account resources using the client and the contract address
      const tokenInfo = await client.getAccountResource(
        newContractAddress,
        coin,
      );

      if (!tokenInfo) {
        throw 'Invalid ContractAddress';
      }

      const formattedResponseObject: CustomTokenInfo = {
        decimals: tokenInfo?.data?.decimals ?? '8',
        name: tokenInfo?.data?.name ?? '',
        symbol: tokenInfo?.data?.symbol ?? '',
        type: tokenInfo?.type ?? '',
        contractAddress: newContractAddress,
      };

      if (shouldFetchBalance) {
        try {
          const walletAddress = getWalletAddress(tokenObj?.networkName);
          const coinForBalance = `0x1::coin::CoinStore<${contractAddress}>`;

          const tokenDataForBalance = await client.getAccountResource(
            walletAddress,
            coinForBalance,
          );

          const tokenBalance =
            tokenDataForBalance?.data?.coin?.value?.toString() ?? '0';
          const formattedBalance = formatErc20Token(
            tokenBalance,
            Number(formattedResponseObject.decimals),
          );

          return {
            ...formattedResponseObject,
            balance: formattedBalance,
          };
        } catch (error) {
          return formattedResponseObject;
        }
      } else {
        return formattedResponseObject;
      }
    } catch (error: any) {
      // Log the error if needed
      console.error('Error in getTokenInformationFromAddress:', error);
      throw new Error('Invalid Error');
    }
  };

  /**
   * Function to register a coin with the provided contract information and token object.
   * @param {CustomTokenInfo} contractInfo - An object containing custom token information.
   * @param {Pick<ExistingNetworksItem, 'providerNetworkRPC_URL' | 'tokenContractAddress' | 'providerNetworkRPC_Network_Name' | 'networkName'>} tokenObj - An object containing the necessary token information.
   * @returns {Promise<any>} - Returns a promise that resolves to the result of the registration process.
   */
  const registerCoin = async (
    tokenObj: Pick<
      ExistingNetworksItem,
      | 'providerNetworkRPC_URL'
      | 'tokenContractAddress'
      | 'providerNetworkRPC_Network_Name'
      | 'networkName'
    >,
  ) => {
    try {
      // Retrieve the wallet address using the getWalletAddress function
      const walletAddress = getWalletAddress(tokenObj?.networkName);

      // Retrieve the provider using the provided token object
      const client = getProvider(tokenObj);

      // Retrieve the private key using the getPrivateKey function
      const privateKey = await getPrivateKey();

      // Convert the private key to bytes
      const privateKeyBytes = HexString.ensure(privateKey).toUint8Array();
      const myAccount = new AptosAccount(privateKeyBytes);

      // Generate a raw transaction using the client's generateTransaction method
      const rawTxn = await client.generateTransaction(walletAddress, {
        function: Aptos_Coin_Register,
        type_arguments: [tokenObj?.tokenContractAddress],
        arguments: [],
      });

      // Sign the transaction using the client's signTransaction method
      const bcsTxn = await client.signTransaction(myAccount, rawTxn);

      // Submit the transaction using the client's submitTransaction method
      const txn = await client.submitTransaction(bcsTxn);

      if (txn.hash) {
        // Return the transaction if the hash is available
        return txn;
      } else {
        // Return null if the hash is not available
        return null;
      }
    } catch (error: any) {
      // Display an error toast and log the error if it occurs during the registration process
      showToast('error', t('common:something_went_wrong_please_try_again'));
      console.log('Failed to registerCoin: ' + error.message);
      return null;
    }
  };

  /**
   * Function to check and register a token if it does not already exist for a specific wallet address.
   * @param {string} walletAddress - The wallet address to check and register the token for.
   * @param {Pick<ExistingNetworksItem, 'providerNetworkRPC_URL' | 'tokenContractAddress' | 'providerNetworkRPC_Network_Name' | 'networkName'>} tokenObj - An object containing the necessary token information.
   * @param {CustomTokenInfo} contractInfo - An object containing custom token information.
   * @returns {Promise<any>} - Returns a promise that resolves to the result of the check and register process.
   */
  const checkAndRegister = async (
    walletAddress: string,
    tokenObj: Pick<
      ExistingNetworksItem,
      | 'providerNetworkRPC_URL'
      | 'tokenContractAddress'
      | 'providerNetworkRPC_Network_Name'
      | 'networkName'
    >,
  ) => {
    try {
      // Retrieve the provider using the provided token object
      const client = getProvider(tokenObj);

      // Get account resources using the client and the wallet address
      const coinForBalance = `0x1::coin::CoinStore<${tokenObj?.tokenContractAddress}>`;

      const tokenData = await client.getAccountResource(
        walletAddress,
        coinForBalance,
      );

      if (tokenData) {
        // Return the token data if it already exists
        return tokenData;
      } else {
        // Register the coin if it does not already exist
        await registerCoin(tokenObj);
      }
    } catch (error: any) {
      // Display an error toast and log the error if it occurs during the check and register process
      showToast('error', t('common:something_went_wrong_please_try_again'));
      console.error('Failed to fetch checkAndRegister:', error);
      return null;
    }
  };

  /**
   * Function to get the Aptos custom token balance for a list of existing network items.
   * @param {ExistingNetworksItem[]} item - An array of existing network items.
   */
  const getAptosCustomTokenBalance = async (items: ExistingNetworksItem[]) => {
    try {
      // Ensure there are items in the array
      if (!items || items.length === 0) {
        return;
      }

      // Retrieve the provider using the first item in the array
      const client = getProvider(items[0]);

      // Retrieve the wallet address using the network name from the first item
      const walletAddress = getWalletAddress(items[0]?.networkName);

      // Get account resources using the client and the wallet address
      const resources = await client.getAccountResources(walletAddress);

      const allTokenBalanceFormattedObjArray: {
        tokenBalance: any;
        tokenName: string;
      }[] = [];

      // Iterate through each token object in the array
      for (const tokenObject of items) {
        try {
          // Get token information using the getTokenInformationFromAddress function
          const coinInfo = await getCustomTokenInformation(
            tokenObject?.tokenContractAddress,
            tokenObject,
          );

          const coin = `0x1::coin::CoinStore<${tokenObject?.tokenContractAddress}>`;

          const tokenData = resources?.find(itemObj =>
            itemObj?.type.includes(coin),
          );

          // Skip to the next iteration if coinInfo name or tokenData is not available
          if (!coinInfo?.name || !tokenData) {
            continue;
          }

          // Retrieve and format the token balance
          const tokenBalance = tokenData?.data?.coin?.value?.toString() ?? '0';
          const formattedBalance = formatErc20Token(
            tokenBalance,
            Number(coinInfo?.decimals ?? 8),
          );

          // Push the formatted balance and token name to the allTokenBalanceFormattedObjArray
          allTokenBalanceFormattedObjArray.push({
            tokenBalance: formattedBalance,
            tokenName: tokenObject.shortName,
          });
        } catch (error) {
          // Log the error for this specific token but continue with others
          console.error(
            `Error processing token ${tokenObject.shortName}:`,
            error,
          );
        }
      }

      // Update the multiple token balances in the store using StoreUpdateReduxWalletStateService
      StoreUpdateReduxWalletStateService().updateMultipleTokenBalanceInStore(
        allTokenBalanceFormattedObjArray,
      );
    } catch (error) {
      // Log the error if it occurs during the balance retrieval process
      console.error('Error in getAptosCustomTokenBalance:', error);
    }
  };
  /**
   * Function to reset the wallet by setting the cachedWallet to null.
   */
  const resetWallet = () => {
    cachedWallet = null;
  };

  const getPrivateKeyUsingSeedPhrase = (pathIndex: string = '0') => {
    try {
      // Check if the wallet is from the seed phase
      const seedPhrase = store.getState().wallet.data.seedPhrase;
      if (!seedPhrase) {
        throw new Error('Seed phrase not available.');
      }

      const derivationPath = `m/44'/637'/0'/0'/${pathIndex}'`;
      // Derive the account using the provided derivation path and mnemonic
      const account = AptosAccount.fromDerivePath(derivationPath, seedPhrase);
      // Convert the account object to a private key object
      const accountObj = account.toPrivateKeyObject();
      const privateKey = accountObj.privateKeyHex?.toString();
      return privateKey;
    } catch (error) {
      // Log the error and return null if an error occurs
      console.error('Error in getPrivateKeyUsingSeedPhrase:', error);
      return null;
    }
  };

  const getTransactionFunctionName = (
    transaction,
    tokenObj: ExistingNetworksItem,
  ) => {
    if (tokenObj.tokenType === 'Native') {
      const isAptosTransaction =
        transaction?.payload?.type_arguments
          ?.toString()
          ?.toLowerCase()
          ?.includes('aptos') ||
        transaction?.payload?.type_arguments?.length === 0;

      return isAptosTransaction ? '' : transaction?.payload?.function;
    } else {
      const isCustomTransaction =
        transaction?.payload?.type_arguments?.includes(
          tokenObj.tokenContractAddress,
        );
      return isCustomTransaction ? transaction?.payload?.function : '';
    }
  };

  const getTransactionSender = transaction => {
    return transaction?.payload?.function?.toLowerCase()?.includes('mint')
      ? ''
      : transaction?.sender ?? '';
  };

  const getTransactionToAddress = transaction => {
    return transaction?.payload?.arguments?.length === 2
      ? transaction?.payload?.arguments[0]
      : '';
  };

  const getTransactionValue = transaction => {
    return transaction?.payload?.arguments?.length === 2
      ? transaction?.sender === transaction?.payload?.arguments[0]
        ? '0'
        : transaction?.payload?.arguments[1]
      : transaction?.payload?.arguments[0];
  };

  return {
    getWalletUsingSeed,
    getBalance,
    sendNativeToken,
    getFeeData,
    getTokenActivityListByAddress,
    getTokenTransactionDetails,
    getCustomTokenInformation,
    registerCoin,
    sendCustomToken,
    checkAndRegister,
    getAptosCustomTokenBalance,
    getProvider,
    getWalletUsingPrivateKey,
    getOtherUserBalance,
    resetWallet,
    getPrivateKeyUsingSeedPhrase,
  };
};

export default AptosService;
