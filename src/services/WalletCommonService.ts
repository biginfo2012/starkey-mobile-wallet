import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TransactionReceipt, TransactionRequest } from 'ethers';
import { store } from 'store/index';
import {
  formatErc20Token,
  getWalletAddress,
} from 'theme/Helper/common/Function';
import { NetWorkType, defaultNetwork } from 'theme/Helper/constant';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import AptosService from './AptosService';
import Bip39Manager from './Bip39Manager';
import Erc20TokenService from './Erc20TokenService';
import EthersService from './EthersService';
import SolanaService from './SolanaService';
import StoreUpdateReduxWalletStateService from './StoreUpdateReduxWalletStateService';
import SuiService from './SuiService';
import SupraService from './SupraService';
import { getAllTokenBalanceAndStartObservers } from './apiActions';

const WalletCommonService = () => {
  // Function to get mnemonic
  const createMnemonic = () => {
    let mnemonic = Bip39Manager().createMnemonic(false);
    return mnemonic;
  };

  // Function to get fee data based on the provided token object
  const getFeeData = async (tokenObj: ExistingNetworksItem) => {
    const service = getServiceByNetworkName(tokenObj.networkName);
    return service.getFeeData(tokenObj);
  };

  /**
   * Function to get custom token information by token address.
   * @param {string} contractAddress - The token contract address.
   * @param {ExistingNetworksItem} networkObj - The network object containing information about the network.
   * @returns {Promise<{
   *   symbol: any;
   *   decimals: any;
   *   error?: string;
   *   logoURI: any;
   *   name?: string;
   *   balance?: string;
   * }>} - A promise that resolves to an object containing token information.
   */
  const getCustomTokenInfoByTokenAddress = async (
    contractAddress,
    networkObj,
  ) => {
    if (!contractAddress) {
      return { error: 'Please enter a token address!' };
    }

    try {
      const service = getServiceByNetworkName(networkObj.networkName);
      const tokenInfo = await service.getCustomTokenInformation(
        contractAddress,
        networkObj,
        true,
      );

      // Return the formatted token information
      return {
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        error: tokenInfo.error || '',
        logoURI: tokenInfo.logoURI,
        name: tokenInfo.name || '',
        balance: tokenInfo.balance || '',
      };
    } catch (error) {
      // Handle any errors during the token information retrieval process
      return {
        symbol: '',
        decimals: '',
        error: 'Please enter a valid token address!',
        logoURI: '',
      };
    }
  };

  const sendNativeToken = async (
    toAddress: string,
    amount: string,
    gasPrice: number,
    gasLimit: number,
    onTransactionRequest: (request?: TransactionRequest) => void,
    onTransactionDone: (
      transaction: TransactionReceipt | null | undefined | string,
    ) => void,
    onTransactionFail: (
      transaction: TransactionReceipt | null | undefined | string,
    ) => void,
    tokenObj: ExistingNetworksItem,
    shouldCancelTransaction = false,
    transactionObj: TransactionRequest = {},
  ) => {
    const service = getServiceByNetworkName(tokenObj.networkName);
    service.sendNativeToken(
      toAddress,
      amount,
      gasPrice,
      gasLimit,
      onTransactionRequest,
      onTransactionDone,
      onTransactionFail,
      tokenObj,
      shouldCancelTransaction,
      transactionObj,
    );
  };

  const sendErc20Token = async (
    toAddress: string,
    amount: number,
    onTransactionRequest: (request?: TransactionRequest) => void,
    onTransactionDone: (
      transaction: TransactionReceipt | null | undefined,
    ) => void,
    onTransactionFail: (
      transaction: TransactionReceipt | null | undefined | string,
    ) => void,
    tokenObj: ExistingNetworksItem,
    gasPrice: number = 0,
    gasLimit: number = 0,
  ) => {
    const service = getServiceByNetworkName(tokenObj.networkName);
    service.sendCustomToken(
      toAddress,
      amount,
      gasPrice,
      gasLimit,
      onTransactionRequest,
      onTransactionDone,
      onTransactionFail,
      tokenObj,
    );
  };

  //call this for fetch native balance for ETH network
  const fetchAndStoreEthBalance = async (item: ExistingNetworksItem) => {
    let lastBalance = '';

    const walletAddress = getWalletAddress(
      item?.networkName,
      item?.isEVMNetwork,
    );
    const balance = await EthersService().fetchEthBalance(walletAddress, item);
    if (lastBalance !== balance) {
      StoreUpdateReduxWalletStateService().updateBalanceInStore({
        tokenBalance: balance,
        tokenName: item?.shortName,
      });
    }
  };

  //call this for fetch native balance for SOLANA
  const fetchAndStoreSolanaBalance = async (item: ExistingNetworksItem) => {
    let lastBalance = '0';

    const walletAddress = getWalletAddress(
      item?.networkName,
      item?.isEVMNetwork,
    );
    const balance = await SolanaService().getBalance(walletAddress, item);
    if (lastBalance !== balance) {
      const formattedBalance = (
        parseFloat(balance) / LAMPORTS_PER_SOL
      ).toString();

      StoreUpdateReduxWalletStateService().updateBalanceInStore({
        tokenBalance: formattedBalance,
        tokenName: item?.shortName,
      });
    }
  };

  //call this for fetch native balance for SUI
  const fetchAndStoreSuiBalance = async (item: ExistingNetworksItem) => {
    const walletAddress = getWalletAddress(
      item?.networkName,
      item?.isEVMNetwork,
    );
    const balance = await SuiService().getBalance(walletAddress, item);
    let decimals = 0;
    if (decimals === 0) {
      decimals = await SuiService().getDecimals(balance?.coinType, item);
    }
    const formattedBalance = formatErc20Token(balance?.totalBalance, decimals);
    StoreUpdateReduxWalletStateService().updateBalanceInStore({
      tokenBalance: formattedBalance,
      tokenName: item?.shortName,
    });
  };

  //call this for fetch native balance for APTOS
  const fetchAndStoreAptosBalance = async (item: ExistingNetworksItem) => {
    let lastBalance = '0';

    const balance = await AptosService().getBalance(item);
    if (lastBalance !== balance) {
      const formattedBalance = formatErc20Token(balance, 8);
      StoreUpdateReduxWalletStateService().updateBalanceInStore({
        tokenBalance: formattedBalance,
        tokenName: item?.shortName,
      });
    }
  };

  //call this for fetch native balance for APTOS
  const fetchAndStoreSUPRABalance = async (item: ExistingNetworksItem) => {
    let lastBalance = '0';

    const balance = await SupraService().getBalance(item);
    if (lastBalance !== balance) {
      const formattedBalance = formatErc20Token(balance, 6);
      StoreUpdateReduxWalletStateService().updateBalanceInStore({
        tokenBalance: formattedBalance,
        tokenName: item?.shortName,
      });
    }
  };

  const fetchAndStoreERC20TokenBalance = async (
    item: ExistingNetworksItem[],
  ) => {
    const oldWalletAddress = getWalletAddress(defaultNetwork, true);
    const allTokenBalances =
      await Erc20TokenService().fetchAllErc20TokenBalance(item);
    const newWalletAddress = getWalletAddress(defaultNetwork, true);

    // Update the Redux store with token balance and token name information
    if (newWalletAddress === oldWalletAddress) {
      StoreUpdateReduxWalletStateService().updateMultipleTokenBalanceInStore(
        allTokenBalances,
      );
    }
  };

  const createDefaultWallet = async (
    mnemonic: string,
    pathIndex: string = '0',
  ) => {
    const wallet = await EthersService().createWalletUsingSeed(
      mnemonic,
      pathIndex,
    );
    return wallet;
  };

  const getWalletUsingSeed = async (
    tokenObj: ExistingNetworksItem,
    pathIndex?: string,
  ) => {
    resetAllWallet(tokenObj.networkName);
    let wallet = {};
    const service = getServiceByNetworkName(tokenObj.networkName);
    let derivationPathIndex = '0';
    if (pathIndex) {
      derivationPathIndex = pathIndex;
    } else {
      derivationPathIndex = getNextDerivationPathIndex(tokenObj.networkName);
    }
    wallet = await service.getWalletUsingSeed(
      store.getState().wallet.data.seedPhrase,
      derivationPathIndex,
    );
    if (wallet?.address) {
      StoreUpdateReduxWalletStateService().updateWalletAddressInStore(
        wallet.address,
        tokenObj.networkName,
        derivationPathIndex,
      );
    }
  };

  const resetAllWallet = (networkName?: string) => {
    if (networkName) {
      const service = getServiceByNetworkName(networkName);
      service.resetWallet();
    } else {
      EthersService().resetWallet();
      AptosService().resetWallet();
      SolanaService().resetWallet();
      SuiService().resetWallet();
      SupraService().resetWallet();
    }
  };

  const getBalanceAfterTransaction = (tokenObj: ExistingNetworksItem) => {
    let tempTokenObjs = { [tokenObj.shortName]: tokenObj };

    if (tokenObj.tokenType !== 'Native') {
      tempTokenObjs = {
        ...tempTokenObjs,
        [tokenObj.networkName]:
          store.getState().wallet.data.currentUserTokenArrayWithBalance[
            tokenObj.networkName
          ],
      };
    }
    store.dispatch(
      getAllTokenBalanceAndStartObservers({
        data: tempTokenObjs,
        networkEnvironment: store.getState().wallet.data.networkEnvironment,
      }),
    );
  };

  const getWalletUsingPrivateKey = (
    privateKey: string,
    netWorkType: string,
  ) => {
    const service = getServiceByNetworkName(netWorkType);
    return service.getWalletUsingPrivateKey(privateKey);
  };

  const getPrivateKeyUsingSeedPhrase = (
    pathIndex: string = '0',
    netWorkType: string,
  ) => {
    const service = getServiceByNetworkName(netWorkType);
    return service.getPrivateKeyUsingSeedPhrase(pathIndex);
  };

  const getServiceByNetworkName = (networkName: string) => {
    switch (networkName) {
      case NetWorkType.SUI:
        return SuiService();
      case NetWorkType.SOL:
        return SolanaService();
      case NetWorkType.APT:
        return AptosService();
      case NetWorkType.SUP:
        return SupraService();
      default:
        return EthersService();
    }
  };

  // Asynchronous function to get the derivation path index and check wallet address is exists or not
  const getDerivationPathIndex = (netWorkType: string) => {
    const derivationIndex =
      store.getState().wallet.data.walletAddress[
        store.getState().userInfo.data.currentUserId
      ][netWorkType].derivationIndex;
    return derivationIndex ?? 0;
  };

  // function to get the derivation path index and check wallet address is exists or not
  const getNextDerivationPathIndex = (
    netWorkType: string,
    derivationIndex: string = '0',
  ): string => {
    const tempPathIndex = derivationIndex;
    const isExist = checkDerivationIndexExists(tempPathIndex, netWorkType);
    if (isExist) {
      return getNextDerivationPathIndex(
        netWorkType,
        `${Number(tempPathIndex) + 1}`,
      );
    } else {
      return tempPathIndex;
    }
  };

  const checkDerivationIndexExists = (
    derivationIndex: string,
    netWorkType: string,
  ) => {
    const walletAddressList = store.getState().wallet.data.walletAddress;
    for (const key in walletAddressList) {
      if (walletAddressList[key].hasOwnProperty(netWorkType)) {
        const cryptoObj = walletAddressList[key][netWorkType];
        if (cryptoObj && cryptoObj.derivationIndex === derivationIndex) {
          return true;
        }
      }
    }
    return false;
  };

  return {
    createMnemonic,
    sendNativeToken,
    fetchAndStoreEthBalance,
    sendErc20Token,
    fetchAndStoreERC20TokenBalance,
    getFeeData,
    fetchAndStoreSolanaBalance,
    fetchAndStoreSuiBalance,
    fetchAndStoreAptosBalance,
    fetchAndStoreSUPRABalance,
    resetAllWallet,
    getWalletUsingSeed,
    getBalanceAfterTransaction,
    getCustomTokenInfoByTokenAddress,
    getWalletUsingPrivateKey,
    getPrivateKeyUsingSeedPhrase,
    createDefaultWallet,
    getServiceByNetworkName,
    getDerivationPathIndex,
    getNextDerivationPathIndex,
  };
};

export default WalletCommonService;
