import {
  getParsedEthersError,
  EthersError,
} from '@enzoferey/ethers-error-parser';
import {
  HDNodeWallet,
  Mnemonic,
  TransactionReceipt,
  TransactionRequest,
  ethers,
  formatUnits,
} from 'ethers';
import { t } from 'i18next';
import { store } from 'store/index';
import {
  formatErc20Token,
  formatErc20TokenConvertNormal,
  formatEther,
  getWalletAddress,
  parseEther,
  showToast,
} from 'theme/Helper/common/Function';
import {
  Erc20TokenABI,
  NetWorkType,
  PAGINATION_COUNT_20,
  defaultNetwork,
  evmErrorMessages,
} from 'theme/Helper/constant';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';
import {
  ActivityRequestType,
  EVMNativeTokenBalanceRequestType,
  GasFeeData,
} from 'types/applicationInterfaces';

import Erc20TokenService from './Erc20TokenService';
import StoreUpdateReduxWalletStateService from './StoreUpdateReduxWalletStateService';
import WalletCommonService from './WalletCommonService';
import WalletSigner from './WalletSigner';

// Declaration of variables
let cachedWallet: any;
let lastAccountCreateDerivation: string;
let lastNetworkURL: string;
let lastNetworkName: string | number;
let cachedProvider: ethers.WebSocketProvider | ethers.JsonRpcProvider;

const EthersService = () => {
  // Abort controller and signal for request cancellation
  const controller = new AbortController();
  const signal = controller.signal;

  // Function to create an ethers provider based on URL and network
  const createProvider = (url: string, network: string | number) => {
    if (
      url &&
      network &&
      lastNetworkURL !== url &&
      lastNetworkName !== network
    ) {
      lastNetworkURL = url;
      lastNetworkName = network;
      if (url.startsWith('wss://')) {
        cachedProvider = new ethers.WebSocketProvider(url, network);
      } else {
        cachedProvider = new ethers.JsonRpcProvider(url, network, {
          batchMaxCount: 1,
        });
      }
    }

    return cachedProvider;
  };

  // Function to get an ethers provider based on URL and network
  const getProvider = (url: string, network: string | number) => {
    return createProvider(url, network);
  };

  const getAndInitContract = (
    contractAddress: string,
    ABI: any[],
    signer: any,
  ) => {
    return new ethers.Contract(contractAddress, ABI, signer);
  };

  const getAndInitContractWithOutSigner = (
    contractAddress: string,
    ABI: any[],
  ) => {
    return new ethers.Contract(contractAddress, ABI);
  };

  // Function to create an ethers wallet based on mnemonic and path index
  const createWalletUsingSeed = (mnemonic: string, pathIndex: string = '0') => {
    try {
      if (cachedWallet && lastAccountCreateDerivation === pathIndex) {
        return cachedWallet;
      } else {
        const newMnemonic = Mnemonic.fromPhrase(mnemonic);
        const derivationPath = `m/44'/60'/0'/0/${pathIndex}`;
        let wallet = ethers.HDNodeWallet.fromMnemonic(
          newMnemonic,
          derivationPath,
        );

        StoreUpdateReduxWalletStateService().updateSeedPhraseInStore(mnemonic);
        cachedWallet = wallet;
        lastAccountCreateDerivation = pathIndex;
        return wallet;
      }
    } catch (error: any) {
      showToast('error', t('common:Invalid_seed_phrase'));
      console.log('Failed to createWalletUsingSeed' + error.message);
    }
  };

  // Function to get an ethers wallet based on mnemonic and path index
  const getWalletUsingSeed = (pathIndex: string = '0') => {
    if (store.getState().userInfo.data.currentUser.isWalletFromSeedPhase) {
      const newMnemonic = Mnemonic.fromPhrase(
        store.getState().wallet.data.seedPhrase,
      );
      const path = `m/44'/60'/0'/0/${pathIndex}`;
      let wallet = ethers.HDNodeWallet.fromMnemonic(newMnemonic, path);
      return wallet;
    } else {
      let wallet = new ethers.Wallet(
        store.getState().userInfo.data.currentUser.privateKey,
      );
      return wallet;
    }
  };

  // Function to get an ethers wallet based on private key
  const getWalletUsingPrivateKey = (privateKey: string) => {
    try {
      var wallet = new ethers.Wallet(privateKey);
      return wallet.address;
    } catch (error: any) {
      showToast('error', t('onBoarding:invalid_private_key'));
      console.log('getWalletUsingPrivateKey error: ' + error.message);
      return '';
    }
  };

  // Function to create an ethers transaction object
  const createTransactionObject = (transactionObj: TransactionRequest) => {
    const tx: TransactionRequest = {
      ...transactionObj,
    };
    return tx;
  };

  // Function to get the balance of an address
  const getBalance = async (
    address: string,
    tokenObj: ExistingNetworksItem,
  ): Promise<string> => {
    try {
      let lastBalance = null;
      let newBalance = 0;
      const provider = getProvider(
        tokenObj?.providerNetworkRPC_URL,
        tokenObj?.providerNetworkRPC_Network_Name,
      );
      if (lastBalance === newBalance) {
        return;
      }
      newBalance = await provider?.getBalance(address);
      lastBalance = newBalance;
      return ethers.formatEther(newBalance);
    } catch (error: any) {
      console.log('Failed to fetch balance ETH: ' + error.message);
    }
  };

  // Function to get the transaction history of an address
  const getTokenActivityListByAddress = async ({
    walletAddress,
    contractAddress,
    page,
    netWorkName = 'goerli',
  }: ActivityRequestType): Promise<any> => {
    try {
      let etherscanProvider = new ethers.EtherscanProvider(netWorkName);

      if (contractAddress) {
        const resObj = await etherscanProvider.fetch('account', {
          action: 'tokentx',
          address: walletAddress,
          sort: 'desc',
          contractaddress: contractAddress,
          page: page,
          offset: PAGINATION_COUNT_20,
        });
        return { data: resObj, isNativeToken: false };
      } else {
        const resObj = await etherscanProvider.fetch('account', {
          action: 'txlist',
          address: walletAddress,
          page: page,
          offset: PAGINATION_COUNT_20,
          sort: 'desc',
        });
        return { data: resObj, isNativeToken: true };
      }
    } catch (error) {
      console.log('error', error);
      return { data: [], isNativeToken: true };
    }
  };

  // Function to get the transaction details of a token transaction
  async function getTokenTransactionDetails({
    walletAddress,
    blockNumber,
    netWorkName = 'goerli',
    tokenInfo,
  }: ActivityRequestType): Promise<any> {
    let etherscanProvider = new ethers.EtherscanProvider(netWorkName);
    if (tokenInfo?.tokenContractAddress) {
      try {
        let response = await etherscanProvider.fetch('account', {
          action: 'tokentx',
          startblock: blockNumber,
          endblock: blockNumber,
          address: walletAddress,
        });
        return response;
      } catch (error) {
        console.log('error', error);
        return [];
      }
    } else {
      try {
        let response = await etherscanProvider.fetch('account', {
          action: 'txlist',
          startblock: blockNumber,
          endblock: blockNumber,
          address: walletAddress,
        });
        return response;
      } catch (error) {
        console.log('error', error);
        return [];
      }
    }
  }

  // Function to get the native token balance of a wallet address
  async function getEVMNativeTokenBalance({
    walletAddress,
    netWorkName = 'goerli',
    shortName = NetWorkType.ETH,
  }: EVMNativeTokenBalanceRequestType): Promise<{
    balance?: string;
    shortName: string;
  }> {
    controller.abort();
    let etherscanProvider = new ethers.EtherscanProvider(netWorkName);
    try {
      let response = await etherscanProvider.fetch('account', {
        action: 'balance',
        tag: 'latest',
        address: walletAddress,
        signal,
      });
      const currentUserWalletAddress = getWalletAddress(defaultNetwork, true);
      if (currentUserWalletAddress === walletAddress) {
        return { balance: formatEther(response ?? 0), shortName: shortName };
      }
    } catch (error) {
      return { shortName: '' };
    }
  }

  // Function to get the estimated time required for a transaction
  const fetchEstimatedTimeRequiredForTransaction = async (gasPrice: number) => {
    let etherscanProvider = new ethers.EtherscanProvider('mainnet');
    try {
      let response = await etherscanProvider.fetch('gastracker', {
        action: 'gasestimate',
        gasprice: gasPrice,
      });
      return response;
    } catch (error) {
      return undefined;
    }
  };

  // Function to get the balance of an ETH.
  const fetchEthBalance = async (
    ethAddress: string,
    tokenObj: ExistingNetworksItem,
  ) => {
    return await getBalance(ethAddress, tokenObj);
  };

  /**
   * Asynchronous function to send native tokens (e.g., ETH) to a recipient address.
   * @param toAddress The recipient's address.
   * @param amount The amount of native tokens to send.
   * @param gasPrice The gas price in Gwei.
   * @param gasLimit The gas limit for the transaction.
   * @param onTransactionRequest Callback function called when the transaction request is made.
   * @param onTransactionDone Callback function called when the transaction is successfully completed.
   * @param onTransactionFail Callback function called when the transaction fails or encounters an error.
   * @param tokenObj The object containing information about the token and network.
   * @param shouldCancelTransaction Optional parameter indicating whether to cancel the transaction.
   * @param transactionObj Optional parameter containing custom transaction properties.
   */
  const sendNativeToken = async (
    toAddress: string,
    amount: string,
    gasPrice: number,
    gasLimit: number,
    onTransactionRequest: (request?: TransactionRequest) => void,
    onTransactionDone: (
      transaction: TransactionReceipt | null | undefined,
    ) => void,
    onTransactionFail: (
      transaction: TransactionReceipt | null | undefined | string,
    ) => void,
    tokenObj: ExistingNetworksItem,
    shouldCancelTransaction = false,
    transactionObj: TransactionRequest = {},
  ) => {
    try {
      // Get the provider based on the token's network URL and name
      const provider = getProvider(
        tokenObj?.providerNetworkRPC_URL,
        tokenObj?.providerNetworkRPC_Network_Name,
      );
      // Get the wallet address based on the network name and type
      const walletAddress = getWalletAddress(
        tokenObj.networkName,
        tokenObj.isEVMNetwork,
      );
      // Get the current fee data from the provider
      const feeData = await provider?.getFeeData();

      // Create the transaction object based on the provided parameters
      const transaction = createTransactionObject(
        shouldCancelTransaction
          ? transactionObj
          : {
              from: walletAddress,
              to: toAddress,
              value: parseEther(amount),
              gasPrice: gasPrice
                ? gasPrice * Math.pow(10, 9)
                : Number(feeData?.gasPrice),
              gasLimit:
                gasLimit || (tokenObj?.title !== 'BNB' ? 21000 : undefined),
              nonce: await provider?.getTransactionCount(
                walletAddress,
                'latest',
              ),
            },
      );

      // Percentage to decrease gas price by (30% in this example)
      const percentageToDecrease = 30;
      // Convert the percentage to a BigInt
      const bigIntPercentage = BigInt(percentageToDecrease);
      // Calculate the decreased gas price
      const increasedValue =
        feeData?.gasPrice +
        (feeData?.gasPrice * bigIntPercentage) / BigInt(100);

      // Invoke the onTransactionRequest callback with the transaction object
      onTransactionRequest(
        shouldCancelTransaction
          ? undefined
          : {
              ...transaction,
              ...{
                gasPrice: increasedValue,
              },
            },
      );

      // Sign the transaction using the wallet signer
      await WalletSigner().signTransaction(transaction, tokenObj);
      // Get the signing wallet
      const signWallet = (await WalletSigner().signWallet(
        tokenObj,
      )) as HDNodeWallet;

      // Send the signed transaction and get the transaction response
      const transactionResponse = await signWallet.sendTransaction(transaction);
      // Get the transaction receipt
      const txReceipt = await transactionResponse.getTransaction();
      // Wait for the transaction to be mined
      const completedTransaction = await provider?.waitForTransaction(
        txReceipt?.hash ?? '',
        1,
        150000,
      );

      // Check if the transaction was successfully mined
      if (completedTransaction?.status === 1) {
        // Invoke the onTransactionDone callback with the completed transaction
        onTransactionDone(completedTransaction);
        // Update the wallet balance after the transaction
        WalletCommonService().getBalanceAfterTransaction(tokenObj);
      } else {
        // Invoke the onTransactionFail callback with the completed transaction (indicating failure)
        onTransactionFail(completedTransaction);
      }
    } catch (error: any) {
      // Extract error message using regular expression
      const errorMessageMatch = error.message.match(/"message": "([^"]+)"/);
      const errorMessage1 = errorMessageMatch
        ? errorMessageMatch[1]
        : 'Unknown error';

      const errorMessage =
        evmErrorMessages[error.code] ||
        errorMessage1 ||
        'Error sending transaction';
      onTransactionFail(errorMessage);
    }
  };

  /**
   * Asynchronous function to send custom tokens (ERC-20 tokens) to a recipient address.
   * @param toAddress The recipient's address.
   * @param amount The amount of custom tokens to send.
   * @param gasPrice The gas price in Gwei.
   * @param gasLimit The gas limit for the transaction.
   * @param onTransactionRequest Callback function called when the transaction request is made.
   * @param onTransactionDone Callback function called when the transaction is successfully completed.
   * @param onTransactionFail Callback function called when the transaction fails or encounters an error.
   * @param tokenObj The object containing information about the token and network.
   */
  const sendCustomToken = async (
    toAddress: string,
    amount: number,
    gasPrice: number,
    gasLimit: number,
    onTransactionRequest: (request?: TransactionRequest) => void,
    onTransactionDone: (
      transaction: TransactionReceipt | null | undefined,
    ) => void,
    onTransactionFail: (
      transaction: TransactionReceipt | null | undefined | string,
    ) => void,
    tokenObj: ExistingNetworksItem,
  ) => {
    try {
      // Get the provider based on the token's network URL and name
      const provider = getProvider(
        tokenObj?.providerNetworkRPC_URL,
        tokenObj?.providerNetworkRPC_Network_Name,
      );
      // Get the ERC-20 token contract instance
      const contract = await Erc20TokenService().getContract(
        tokenObj?.tokenContractAddress,
        tokenObj,
      );
      // Get the number of decimal places for the token
      const decimal = await contract.decimals();
      // Convert the token amount to the token's base unit
      const value = formatErc20TokenConvertNormal(
        amount,
        decimal.toString(),
      ).toString();

      // Estimate the gas required for the transaction
      const estimatedGas =
        (gasPrice > 0 && gasPrice * Math.pow(10, 9)) ||
        (await contract.transfer.estimateGas(toAddress, value));

      // Get the nonce for the transaction
      const nonce = await provider?.getTransactionCount(
        getWalletAddress(tokenObj?.networkName, tokenObj?.isEVMNetwork),
        'latest',
      );

      // Create the transaction object
      const transaction = await contract.transfer(toAddress, value, {
        nonce: nonce,
        gasPrice: estimatedGas,
      });

      // Invoke the onTransactionRequest callback with the transaction object
      onTransactionRequest({
        ...transaction,
        ...{
          gasPrice: estimatedGas + 1000000000,
        },
      });

      // Get the transaction receipt
      const txReceipt = await transaction.getTransaction();
      // Wait for the transaction to be mined
      const completedTransaction = await txReceipt?.wait();

      // Check if the transaction was successfully mined
      if (completedTransaction?.status === 1) {
        // Invoke the onTransactionDone callback with the completed transaction
        onTransactionDone(completedTransaction);
        // Update the wallet balance after the transaction
        WalletCommonService().getBalanceAfterTransaction(tokenObj);
      } else {
        // Invoke the onTransactionFail callback with the completed transaction (indicating failure)
        onTransactionFail(completedTransaction);
      }
    } catch (error: any) {
      // Log any errors encountered during transaction sending
      console.log('Error?', error);
      // Parse the Ethereum error and invoke the onTransactionFail callback with the error context
      const parsedEthersError = getParsedEthersError(error as EthersError);
      onTransactionFail(parsedEthersError.context);
    }
  };

  // Get the gas fee data for the transaction
  const getFeeData = async (
    tokenObj: ExistingNetworksItem,
  ): Promise<GasFeeData> => {
    const provider = getProvider(
      tokenObj?.providerNetworkRPC_URL,
      tokenObj?.providerNetworkRPC_Network_Name,
    );
    const feeData = await provider?.getFeeData();

    return {
      gasPrice: formatUnits(feeData?.gasPrice, 'gwei'),
      maxFeePerGas: feeData?.maxFeePerGas
        ? formatUnits(feeData?.maxFeePerGas, 'gwei')
        : 0,
      maxPriorityFeePerGas: feeData?.maxPriorityFeePerGas
        ? formatUnits(feeData?.maxPriorityFeePerGas, 'gwei')
        : 0,
    };
  };

  const resetWallet = () => {
    cachedWallet = null;
  };

  /**
   * Asynchronous function to retrieve information about a custom token (ERC-20 token).
   * @param contractAddress The address of the ERC-20 token contract.
   * @param networkObj The object containing information about the network.
   * @returns An object containing token information such as symbol, decimals, and balance, or an error message if the token address is invalid.
   */
  const getCustomTokenInformation = async (
    contractAddress: string,
    networkObj: ExistingNetworksItem,
  ) => {
    // Check if the contract address has a valid length (42 characters)
    if (contractAddress.length === 42) {
      // Valid contract address length
      try {
        // Get the provider for the network
        const provider = EthersService().getProvider(
          networkObj.providerNetworkRPC_URL,
          networkObj.providerNetworkRPC_Network_Name,
        );
        // Initialize the ERC-20 token contract
        const res = EthersService().getAndInitContract(
          contractAddress,
          Erc20TokenABI,
          provider,
        );
        // Retrieve the symbol and decimals of the token
        const symbol = await res.symbol();
        const decimals = await res.decimals();
        // Get the wallet address
        const address = getWalletAddress(
          networkObj?.networkName,
          networkObj?.isEVMNetwork,
        );
        // Get the balance of the wallet for the token
        const balance = await res?.balanceOf(address);
        // Format the token balance
        const formattedBalance = formatErc20Token(balance, decimals);
        // Return token information object
        return {
          symbol: symbol,
          decimals: decimals,
          error: null,
          balance: formattedBalance,
        };
      } catch (error) {
        // Log and return an error message if an error occurs during token information retrieval
        console.log('error??', error);
        return {
          error: 'Token address must be a valid!',
        };
      }
    } else {
      // Return an error message if the token address is invalid
      return {
        error: 'Token address must be a valid!',
      };
    }
  };

  const getNetworkInfoFromUrl = (url: string) => {
    let provider;
    if (url.startsWith('wss://')) {
      provider = new ethers.WebSocketProvider(url);
    } else {
      provider = new ethers.JsonRpcProvider(url);
    }
    return provider;
  };

  // Get the wallet address for the given network
  const getPrivateKeyUsingSeedPhrase = (pathIndex: string = '0') => {
    const newMnemonic = Mnemonic.fromPhrase(
      store.getState().wallet.data.seedPhrase,
    );
    const path = `m/44'/60'/0'/0/${pathIndex}`;
    let wallet = ethers.HDNodeWallet.fromMnemonic(newMnemonic, path);
    return wallet.privateKey;
  };

  return {
    getBalance,
    getProvider,
    getAndInitContract,
    createWalletUsingSeed,
    createTransactionObject,
    getWalletUsingSeed,
    getTokenActivityListByAddress,
    getTokenTransactionDetails,
    getEVMNativeTokenBalance,
    fetchEthBalance,
    getAndInitContractWithOutSigner,
    sendNativeToken,
    getFeeData,
    fetchEstimatedTimeRequiredForTransaction,
    sendCustomToken,
    getWalletUsingPrivateKey,
    resetWallet,
    getCustomTokenInformation,
    getNetworkInfoFromUrl,
    getPrivateKeyUsingSeedPhrase,
  };
};

export default EthersService;
