import { store } from 'store/index';
import { hideUser } from 'store/userInfo';
import {
  updateWalletAddress,
  updateBalance,
  updateUSDRate,
  updateSeedPhrase,
  updateBalanceInBatch,
  updatePrivateKey,
  updateNetworkEnvironment,
  triggerFetchAllTokenBalanceAndStartObservers,
  updateIsWalletFromSeedPhase,
  hideUserTokenData,
} from 'store/wallet';
import { EnvironmentType } from 'types/apiResponseInterfaces';
import {
  TokenBalanceFormatted,
  TokenUSDBalanceFormatted,
} from 'types/applicationInterfaces';

const StoreUpdateReduxWalletStateService = () => {
  /**
   @param {Object} data - An object containing the token name and its corresponding balance.
   @param {string} data.tokenName - The name or identifier of the token.
   @param {string} data.tokenBalance - The updated balance of the token as a string.
   This function is called to update the balance of a token in the store. It takes a 'data' object as input
   which should include the 'tokenName' (name or identifier of the token) and 'tokenBalance'
   (the updated balance of the token as a string).
   The function first checks if the wallet address is available in the store's state. If it's not present,
   the function returns early as there is no need to update the balance without an active wallet.
   If the wallet address is available, the function dispatches an action ('updateBalance') to update the token balance
   in the store. The 'updateBalance' action is expected to be handled by the relevant reducer, which will
   update the token balance for the specified token in the store's state.
   Note: The details of the 'store' object and its associated actions and reducers are not provided in this context,
   as they may vary based on the specific store implementation (e.g., Redux store).
   Function to update the balance of a specific token in the store.
  */
  const updateBalanceInStore = async (data: TokenBalanceFormatted) => {
    let cachedTokenName;
    let cachedTokenBalance;
    const { tokenName, tokenBalance } = data;
    if (cachedTokenName === tokenName && cachedTokenBalance === tokenBalance) {
      return;
    }
    cachedTokenName = tokenName;
    cachedTokenBalance = tokenBalance;
    store.dispatch(updateBalance(data));
  };

  const updateMultipleTokenBalanceInStore = async (
    item: TokenBalanceFormatted[],
  ) => {
    let data;
    // deepcode ignore UsageOfUninitializedVariable
    if (JSON.stringify(item) === JSON.stringify(data)) {
      return;
    }
    data = item;
    store.dispatch(updateBalanceInBatch(data));
  };

  const updateWalletAddressInStore = async (
    walletAddress: string,
    networkName: string,
    derivationIndex: string = '0',
  ) => {
    store.dispatch(
      updateWalletAddress({ walletAddress, networkName, derivationIndex }),
    );
  };

  const updateSeedPhraseInStore = async (seed: string) => {
    store.dispatch(
      updateSeedPhrase({
        seedPhrase: seed,
      }),
    );
  };

  const updatePrivateKeyInStore = async (privateKey: string) => {
    store.dispatch(
      updatePrivateKey({
        privateKey,
      }),
    );
  };

  const updateIsWalletFromSeedPhaseInStore = async (isSeedPhase: boolean) => {
    store.dispatch(
      updateIsWalletFromSeedPhase({
        isSeedPhase,
      }),
    );
  };

  const updateUSDRateInStore = async (data: TokenUSDBalanceFormatted) => {
    let cachedTokenName;
    let cachedTokenUSDPrice;
    const { tokenName, tokenUSDPrice } = data;
    if (
      cachedTokenName === tokenName &&
      cachedTokenUSDPrice === tokenUSDPrice
    ) {
      return;
    }

    cachedTokenName = tokenName;
    cachedTokenUSDPrice = tokenUSDPrice;
    store.dispatch(
      updateUSDRate({
        tokenName: data.tokenName,
        tokenUSDPrice: data.tokenUSDPrice,
      }),
    );
  };

  const updateNetworkEnvironmentInStore = async (envType: EnvironmentType) => {
    if (envType !== store.getState().wallet.data.networkEnvironment) {
      await store.dispatch(
        updateNetworkEnvironment({
          envType,
        }),
      );
      triggerFetchAllTokenBalance();
    }
  };

  const triggerFetchAllTokenBalance = () => {
    store.dispatch(triggerFetchAllTokenBalanceAndStartObservers());
  };

  const hideUserAccount = (userID: string) => {
    store.dispatch(
      hideUser({
        removeUserId: userID,
      }),
    );
    store.dispatch(
      hideUserTokenData({
        removeUserId: userID,
      }),
    );
  };

  return {
    updateBalanceInStore,
    updateWalletAddressInStore,
    updateUSDRateInStore,
    updateSeedPhraseInStore,
    updateMultipleTokenBalanceInStore,
    updatePrivateKeyInStore,
    updateNetworkEnvironmentInStore,
    updateIsWalletFromSeedPhaseInStore,
    hideUserAccount,
  };
};

export default StoreUpdateReduxWalletStateService;
