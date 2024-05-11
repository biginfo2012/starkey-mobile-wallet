import { store } from 'store/index';

const StoreGetWalletStateService = () => {
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
  const getWalletSeedPhrase = () => {
    return store.getState().wallet.data.seedPhrase;
  };

  return {
    getWalletSeedPhrase,
  };
};

export default StoreGetWalletStateService;
