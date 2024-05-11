import { Contract, WebSocketProvider } from 'ethers';
import { store } from 'store/index';
import {
  addRemoveTokenFromList,
  triggerFetchAllTokenBalanceAndStartObservers,
} from 'store/wallet';
import {
  checkTokenIsExists,
  formatErc20Token,
  getImageFromToken,
  getWalletAddress,
  showReceivedTokenModal,
} from 'theme/Helper/common/Function';
import { Erc20TokenABI, NetWorkType } from 'theme/Helper/constant';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';
import { TokenReceivePopUpItem } from 'types/applicationInterfaces';

import EthersService from './EthersService';
import SolanaService from './SolanaService';
import StoreUpdateReduxWalletStateService from './StoreUpdateReduxWalletStateService';
import WalletCommonService from './WalletCommonService';
import WalletSigner from './WalletSigner';
import {
  getAptosCustomTokensBalanceFetch,
  getEVMNativeTokenBalanceFetch,
  getSolanaCustomTokensBalanceFetch,
  getSuiCustomTokensBalanceFetch,
} from './apiActions';

let intervals: { [key: string]: NodeJS.Timer } = {};

let aptosTokenIntervals: { [key: string]: NodeJS.Timer } = {};
let suiTokenIntervals: { [key: string]: NodeJS.Timer } = {};

let contracts: Promise<Contract>[] = [];
let providers: Promise<WebSocketProvider>[] = [];

const BalanceChangeObservers = () => {
  /**
   * Retrieves and stores ERC20 token balance in the Redux store.
   * @param {string} walletAddress - Wallet address for which the balance is retrieved.
   * @param {Contract} contract - ERC20 token contract instance.
   * @param {ExistingNetworksItem} item - Network item containing network information.
   */
  const getAndStoreERC20TokenBalance = async (
    walletAddress: string,
    contract: Contract,
    item: ExistingNetworksItem,
  ) => {
    try {
      // Retrieve the token balance from the ERC20 token contract
      const tokenBalance = await contract?.balanceOf(walletAddress);
      let decimal = 6;

      try {
        // Attempt to retrieve the number of decimal places for the token
        decimal = await contract?.decimals();
      } catch (error) {
        // Handle error during decimals retrieval if needed
      } finally {
        // Format the token balance using the specified number of decimals
        const formattedBalance = formatErc20Token(tokenBalance, decimal);

        // Check if the formatted balance is available
        if (formattedBalance) {
          // Get the wallet address of the currently logged-in user
          const currentUserWalletAddress = getWalletAddress(
            item.networkName,
            item.isEVMNetwork,
          );

          // Check if the current wallet address matches the logged-in user's wallet
          if (currentUserWalletAddress === walletAddress) {
            // Update the token balance in the Redux store
            StoreUpdateReduxWalletStateService().updateBalanceInStore({
              tokenBalance: formattedBalance,
              tokenName: item?.shortName,
            });
          }
        }
      }
    } catch (error) {
      // Handle errors during token balance retrieval if needed
      console.error('Error in getAndStoreERC20TokenBalance:', error);
    }
  };

  /**
   * Dispatches an action to get the Solana token balances for multiple tokens and update the Redux store.
   * @param {ExistingNetworksItem[]} item - Array of network items containing token information.
   */
  const dispatchGetAllSolanaTokenBalance = async (
    item: ExistingNetworksItem[],
  ) => {
    // Check if the item array is valid and contains elements
    if (!item?.length || item?.length === 0) {
      // Return early if the array is invalid or empty
      return;
    }

    // Dispatch the action to get Solana custom tokens balance using Redux Thunk
    store.dispatch(
      getSolanaCustomTokensBalanceFetch({
        item,
      }),
    );
  };

  /**
   * Dispatches an action to get the Aptos token balances for multiple tokens and update the Redux store.
   * @param {ExistingNetworksItem[]} item - Array of network items containing token information.
   */
  const dispatchGetAllAptosTokenBalance = async (
    item: ExistingNetworksItem[],
  ) => {
    // Check if the item array is valid and contains elements
    if (!item?.length || item?.length === 0) {
      // Return early if the array is invalid or empty
      return;
    }

    // Dispatch the action to get Aptos custom tokens balance using Redux Thunk
    store.dispatch(
      getAptosCustomTokensBalanceFetch({
        item,
      }),
    );
  };
  /**
   * Dispatches an action to get the SUI token balances for multiple tokens and update the Redux store.
   * @param {ExistingNetworksItem[]} item - Array of network items containing token information.
   */
  const dispatchGetAllSuiTokenBalance = async (
    item: ExistingNetworksItem[],
  ) => {
    // Check if the item array is valid and contains elements
    if (!item?.length || item?.length === 0) {
      // Return early if the array is invalid or empty
      return;
    }

    // Dispatch the action to get SUI custom tokens balance using Redux Thunk
    store.dispatch(
      getSuiCustomTokensBalanceFetch({
        item,
      }),
    );
  };

  //fetchAllSolanaTokenBalances
  const fetchAllSolanaTokenBalances = (item: ExistingNetworksItem[]) => {
    dispatchGetAllSolanaTokenBalance(item);
  };

  //fetchAllAptosTokenBalances
  const fetchAllAptosTokenBalances = (tokens: ExistingNetworksItem[]) => {
    // Check if the tokens array is valid and contains elements
    if (!tokens?.length) {
      // Return early if the array is invalid or empty
      return;
    }

    // Clear any existing interval for this item.id to avoid multiple intervals
    clearInterval(aptosTokenIntervals[tokens[0]?.id]);

    /**
     * Helper function to fetch Aptos token balance and dispatch the action.
     */
    const fetchAndDispatchAptosTokenBalance = () => {
      dispatchGetAllAptosTokenBalance(tokens);
    };

    // Initial fetch to get Aptos token balances
    fetchAndDispatchAptosTokenBalance();

    // Set up a new interval to periodically fetch Aptos token balances (every 20 seconds)
    aptosTokenIntervals[tokens[0]?.id] = setInterval(
      fetchAndDispatchAptosTokenBalance,
      20000,
    );
  };
  //fetchAllSuiTokenBalances
  const fetchAllSuiTokenBalances = (tokens: ExistingNetworksItem[]) => {
    // Check if the tokens array is valid and contains elements
    if (!tokens?.length) {
      // Return early if the array is invalid or empty
      return;
    }

    // Clear any existing interval for this item.id to avoid multiple intervals
    clearInterval(suiTokenIntervals[tokens[0]?.id]);

    /**
     * Helper function to fetch Sui token balance and dispatch the action.
     */
    const fetchAndDispatchSuiTokenBalance = () => {
      dispatchGetAllSuiTokenBalance(tokens);
    };

    // Initial fetch to get Sui token balances
    fetchAndDispatchSuiTokenBalance();

    // Set up a new interval to periodically fetch Sui token balances (every 20 seconds)
    suiTokenIntervals[tokens[0]?.id] = setInterval(
      fetchAndDispatchSuiTokenBalance,
      20000,
    );
  };

  /**
   * Fetches and stores ERC20 token balances for supported networks using Alchemy API.
   * @param {ExistingNetworksItem[]} tokens - Array of ERC20 tokens.
   */
  const fetchAndStoreSupportedNetworkERC20TokenBalances = (
    tokens: ExistingNetworksItem[],
  ) => {
    const supportedNetworkTokens = tokens.filter(
      item => item?.networkName === NetWorkType.ETH,
    );
    WalletCommonService().fetchAndStoreERC20TokenBalance(
      supportedNetworkTokens,
    );
  };

  /**
   * Fetches and stores ERC20 token balances for non-supported networks using contract calls.
   * @param {ExistingNetworksItem[]} tokens - Array of ERC20 tokens.
   */
  const fetchAndStoreNonSupportedNetworkERC20TokenBalances = async (
    tokens: ExistingNetworksItem[],
  ) => {
    const nonSupportedNetworkTokens = tokens.filter(
      item => !(item?.networkName === NetWorkType.ETH) && item?.isEVMNetwork,
    );

    for (const item of nonSupportedNetworkTokens) {
      const walletAddress = getWalletAddress(
        item?.networkName,
        item?.isEVMNetwork,
      );
      const contract = EthersService().getAndInitContract(
        item?.tokenContractAddress,
        Erc20TokenABI,
        await WalletSigner().signWallet(item),
      );
      getAndStoreERC20TokenBalance(walletAddress, contract, item);
    }
  };

  /**
   * Fetches and stores Solana token balances.
   * @param {ExistingNetworksItem[]} tokens - Array of Solana tokens.
   */
  const fetchSolanaTokenBalances = (tokens: ExistingNetworksItem[]) => {
    const solanaTokens = tokens.filter(
      (item: ExistingNetworksItem) => item.networkName === NetWorkType.SOL,
    );
    fetchAllSolanaTokenBalances(solanaTokens);
  };

  /**
   * Fetches and stores Aptos token balances.
   * @param {ExistingNetworksItem[]} tokens - Array of Aptos tokens.
   */
  const fetchAptosTokenBalances = (tokens: ExistingNetworksItem[]) => {
    const aptosTokens = tokens.filter(
      (item: ExistingNetworksItem) => item.networkName === NetWorkType.APT,
    );
    fetchAllAptosTokenBalances(aptosTokens);
  };

  /**
   * Fetches and stores Sui token balances.
   * @param {ExistingNetworksItem[]} tokens - Array of Sui tokens.
   */
  const fetchSuiTokenBalances = (tokens: ExistingNetworksItem[]) => {
    const suiTokens = tokens.filter(
      (item: ExistingNetworksItem) => item.networkName === NetWorkType.SUI,
    );
    fetchAllSuiTokenBalances(suiTokens);
  };

  /**
   * Fetches and stores all ERC20 token balances for different networks.
   * @param {ExistingNetworksItem[]} ERC20Tokens - Array of ERC20 tokens.
   */
  const fetchAllErc20TokenBalances = (ERC20Tokens: ExistingNetworksItem[]) => {
    if (!ERC20Tokens?.length) {
      return;
    }

    // Fetch and store ERC20 token balances for supported networks using Alchemy API
    fetchAndStoreSupportedNetworkERC20TokenBalances(ERC20Tokens);

    // Fetch and store ERC20 token balances for non-supported networks using contract calls
    fetchAndStoreNonSupportedNetworkERC20TokenBalances(ERC20Tokens);

    // Fetch and store Solana token balances
    fetchSolanaTokenBalances(ERC20Tokens);

    // Fetch and store Aptos token balances
    fetchAptosTokenBalances(ERC20Tokens);

    // Fetch and store Sui token balances
    fetchSuiTokenBalances(ERC20Tokens);
  };

  // Function to get the balance of a erc20 token
  /**
   * Start observing ERC20 token transfer events based on the network type.
   * @param {ExistingNetworksItem} item - The network item.
   */
  const startErc20TokenTransferEventObserver = async (
    item: ExistingNetworksItem,
  ) => {
    const walletAddress = getWalletAddress(
      item?.networkName,
      item?.isEVMNetwork,
    );

    if (item?.providerNetworkRPC_URL) {
      if (item.isEVMNetwork) {
        await startEVMNetworkObserver(walletAddress, item);
      } else if (item?.networkName === NetWorkType.SOL) {
        SolanaService().addEventListener(item, walletAddress);
      }
    }
  };

  /**
   * Start observing ERC20 token transfer events for EVM networks.
   * @param {string} walletAddress - The wallet address.
   * @param {ExistingNetworksItem} item - The network item.
   */
  const startEVMNetworkObserver = async (
    walletAddress: string,
    item: ExistingNetworksItem,
  ) => {
    const signedWallet = await WalletSigner().signWallet(item);
    const contract = EthersService().getAndInitContract(
      item?.tokenContractAddress,
      Erc20TokenABI,
      signedWallet,
    );

    const transferEvent = contract?.on('Transfer', async (from, to, amount) => {
      if (walletAddress.toLowerCase() === to?.toLowerCase()) {
        handleTokenReceiveEvent(walletAddress, contract, item, amount);
      } else if (walletAddress.toLowerCase() === from?.toLowerCase()) {
        handleTokenSendEvent(walletAddress, contract, item);
      }
    });

    // Add the transfer event to the contracts array
    contracts.push(transferEvent);
  };

  /**
   * Handle ERC20 token receive event.
   * @param {string} walletAddress - The wallet address.
   * @param {Contract} contract - The ERC20 token contract.
   * @param {ExistingNetworksItem} item - The network item.
   * @param {BigNumber} amount - The transferred amount.
   */
  const handleTokenReceiveEvent = async (
    walletAddress: string,
    contract: Contract,
    item: ExistingNetworksItem,
    amount: BigNumber,
  ) => {
    const decimal = await contract.decimals();
    const symbol = await contract.symbol();
    const tokenObj = getImageFromToken(item.shortName);

    if (tokenObj) {
      const isExists = checkTokenIsExists(item.shortName);

      if (isExists) {
        getAndStoreERC20TokenBalance(walletAddress, contract, item);
      }

      const popUpObj = {
        type: 'tokenReceive',
        symbol: symbol,
        tokenObj: tokenObj,
        isExists: isExists,
        amount: formatErc20Token(amount, decimal),
        onPressOk: () => (isExists ? callOk() : callAddToken(tokenObj)),
        onPressCancel: onPressCancel,
      } as TokenReceivePopUpItem;

      showReceivedTokenModal(popUpObj);
    }
  };

  /**
   * Handle ERC20 token send event.
   * @param {string} walletAddress - The wallet address.
   * @param {Contract} contract - The ERC20 token contract.
   * @param {ExistingNetworksItem} item - The network item.
   */
  const handleTokenSendEvent = async (
    walletAddress: string,
    contract: Contract,
    item: ExistingNetworksItem,
  ) => {
    const isExists = checkTokenIsExists(item.shortName);

    if (isExists) {
      getAndStoreERC20TokenBalance(walletAddress, contract, item);
    }
  };

  /**
   * Fetch and store native token balance based on the network.
   * @param {ExistingNetworksItem} item - The network item.
   */
  const fetchNativeTokenBalance = (item: ExistingNetworksItem) => {
    switch (item.networkName) {
      case NetWorkType.SUI:
        WalletCommonService().fetchAndStoreSuiBalance(item);
        break;
      case NetWorkType.APT:
        WalletCommonService().fetchAndStoreAptosBalance(item);
        break;
      case NetWorkType.SOL:
        WalletCommonService().fetchAndStoreSolanaBalance(item);
        break;
      case NetWorkType.SUP:
        WalletCommonService().fetchAndStoreSUPRABalance(item);
        break;
      default:
        fetchEVMNativeTokenBalance(item);
        break;
    }
  };

  /**
   * Fetch native token balance for EVM networks.
   * @param {ExistingNetworksItem} item - The network item.
   */
  const fetchEVMNativeTokenBalance = (item: ExistingNetworksItem) => {
    store.dispatch(
      getEVMNativeTokenBalanceFetch({
        walletAddress: getWalletAddress(item?.networkName, item?.isEVMNetwork),
        netWorkName: item?.providerNetworkRPC_Network_Name,
        shortName: item?.shortName,
      }),
    );
  };

  /**
   * Fetch custom token balances for Aptos and SUI tokens.
   */
  const fetchCustomTokenBalance = () => {
    const tokenArray = Object.values(
      store.getState().wallet.data.currentUserTokenArrayWithBalance,
    ) as ExistingNetworksItem[];

    const aptosTokens = tokenArray.filter(
      (item: ExistingNetworksItem) =>
        item.networkName === NetWorkType.APT && item?.tokenType === 'ERC20',
    );
    fetchAptosTokenBalances(aptosTokens);

    const suiTokens = tokenArray.filter(
      (item: ExistingNetworksItem) =>
        item.networkName === NetWorkType.SUI && item?.tokenType === 'ERC20',
    );
    fetchSuiTokenBalances(suiTokens);
  };

  const startEthBalanceObserver = (item: ExistingNetworksItem) => {
    const isSolanaNetwork = item.networkName === NetWorkType.SOL;

    // Clear any existing interval for this item.id
    clearInterval(intervals[item?.id]);

    // Fetch native token balance
    fetchNativeTokenBalance(item);

    if (isSolanaNetwork) {
      SolanaService().addSolanaNativeTokenListener(
        item,
        getWalletAddress(item.networkName, item.isEVMNetwork),
      );
    }

    // Start interval for fetching native token balance and custom token balance
    if (!isSolanaNetwork) {
      intervals[item?.id] = setInterval(() => {
        fetchNativeTokenBalance(item);
        fetchCustomTokenBalance(); // get custom token balance which has not set observe event
      }, 20000);
    }
  };

  const stopSolanaObservers = () => {
    SolanaService()?.removeEventListeners();
  };

  const callAddToken = (tokenObj: ExistingNetworksItem) => {
    store.dispatch(
      addRemoveTokenFromList({
        token: tokenObj,
      }),
    );
    store.dispatch(triggerFetchAllTokenBalanceAndStartObservers());
  };

  const callOk = () => {};
  const onPressCancel = () => {};

  const removeETHObserver = () => {
    Object.values(intervals)?.forEach(value => clearInterval(value));
    intervals = {};
  };

  const removeListeners = () => {
    Object.values(intervals)?.forEach(value => clearInterval(value));
    intervals = {};
    Object.values(aptosTokenIntervals)?.forEach(value => clearInterval(value));
    aptosTokenIntervals = {};
    Object.values(suiTokenIntervals)?.forEach(value => clearInterval(value));
    suiTokenIntervals = {};
    providers?.forEach(async value => {
      (await value).off('block');
    });
    contracts?.forEach(async value => {
      const contract = await value;
      contract.off('Transfer');
    });
    contracts = [];
    providers = [];
    SolanaService()?.removeSolanaNativeTokenEventListeners();
    stopSolanaObservers();
  };

  return {
    fetchAllErc20TokenBalances,
    startEthBalanceObserver,
    removeListeners,
    startErc20TokenTransferEventObserver,
    removeETHObserver,
    fetchAllSolanaTokenBalances,
    fetchAllAptosTokenBalances,
    fetchAllSuiTokenBalances,
    stopSolanaObservers,
    getAndStoreERC20TokenBalance,
    fetchCustomTokenBalance,
    fetchNativeTokenBalance,
    fetchAndStoreNonSupportedNetworkERC20TokenBalances,
    dispatchGetAllSolanaTokenBalance,
  };
};

export default BalanceChangeObservers;
