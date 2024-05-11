import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { t } from 'i18next';
import {
  getTokenActivityListFetch,
  getTokenTransactionDetailsFetch,
  getAllTokenBalanceAndStartObservers,
  getEVMNativeTokenBalanceFetch,
  getUSDPrice,
} from 'services/apiActions';
import {
  generateRandomString,
  parseTokenBalance,
} from 'theme/Helper/common/Function';
import { defaultNetwork, networksURLList } from 'theme/Helper/constant';
import mockData from 'theme/mockData';
import {
  ActivityItemInterface,
  EnvironmentType,
  ExistingNetworksItem,
  WalletAddressInfo,
} from 'types/apiResponseInterfaces';
import { TokenBalanceFormatted } from 'types/applicationInterfaces';

interface WalletInfoState {
  data: {
    walletAddress: { [key: string]: { [key: string]: WalletAddressInfo } };
    seedPhrase: string;
    privateKey: string;
    totalBalance: string;
    tokenArrayWithBalance: {
      [key: string]: { [key: string]: ExistingNetworksItem };
    }; // store network or token which is all user added from tokensList
    currentUserTokenArrayWithBalance: { [key: string]: ExistingNetworksItem }; // store network or token which is current user added from tokensList
    currentSelectedToken?: ExistingNetworksItem; // store current selected network or token
    selectedTokensList: { [key: string]: string[] }; // store only short name like. ['ETH', 'SUI]
    totalUSDBalance: string;
    activityList: ActivityItemInterface[];
    activityListFooterLoader: boolean;
    activityTransactionInfo?: ActivityItemInterface;
    shouldRefetchAllBalanceAndStartBalanceChangeObservers: boolean;
    tokensList: { [key: string]: ExistingNetworksItem }; // All network and token
    isWalletFromSeedPhase: boolean;
    networkEnvironment: EnvironmentType;
  };
  selectedNetworkFilter?: ExistingNetworksItem;
  errorActivityList: string;
  errorActivityTransactionInfo: string;
  loaderActivityList: boolean;
}

const initialState: WalletInfoState = {
  data: {
    walletAddress: {},
    seedPhrase: '',
    privateKey: '',
    totalBalance: '',
    totalUSDBalance: '0',
    tokenArrayWithBalance: {},
    activityList: [],
    activityTransactionInfo: undefined,
    selectedTokensList: {},
    currentSelectedToken: undefined,
    shouldRefetchAllBalanceAndStartBalanceChangeObservers: false,
    activityListFooterLoader: false,
    tokensList: {},
    isWalletFromSeedPhase: false,
    networkEnvironment: 'mainNet',
    currentUserTokenArrayWithBalance: {},
  },
  selectedNetworkFilter: undefined,
  errorActivityList: '',
  errorActivityTransactionInfo: '',
  loaderActivityList: false,
};
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    triggerFetchAllTokenBalanceAndStartObservers: state => {
      state.data.shouldRefetchAllBalanceAndStartBalanceChangeObservers =
        !state.data.shouldRefetchAllBalanceAndStartBalanceChangeObservers;
    },
    updateWalletAddress: (
      state,
      action: PayloadAction<{
        walletAddress: string;
        networkName: string;
        derivationIndex: string;
      }>,
    ) => {
      state.data.walletAddress[action.meta.currentUserId] = {
        ...state.data.walletAddress[action.meta.currentUserId],
        [action.payload?.networkName]: {
          derivationIndex: action.payload?.derivationIndex,
          address: action.payload?.walletAddress,
        },
      };
    },

    updateSeedPhrase: (
      state,
      action: PayloadAction<{ seedPhrase: string }>,
    ) => {
      state.data.seedPhrase = action.payload?.seedPhrase;
    },

    updatePrivateKey: (
      state,
      action: PayloadAction<{ privateKey: string }>,
    ) => {
      state.data.privateKey = action.payload?.privateKey;
    },

    updateIsWalletFromSeedPhase: (
      state,
      action: PayloadAction<{ isSeedPhase: boolean }>,
    ) => {
      state.data.isWalletFromSeedPhase = action.payload?.isSeedPhase;
    },

    /**
     * Updates the balance for a specific token, recalculates total balances,
     * and updates the selected token if it is the updated token.
     * @param state - The current Redux state.
     * @param action - Payload action containing the tokenName and tokenBalance.
     *                Example: { tokenName: 'ABC', tokenBalance: '123.45' }
     */
    updateBalance: (
      state,
      action: PayloadAction<{ tokenName: string; tokenBalance: string }>,
    ) => {
      // Destructure payload properties for easier access
      const { tokenName, tokenBalance } = action.payload || {};

      // Check if the token is present in the current user's token array with balance
      // and if the token balance is different from the new balance
      if (
        !state.data.currentUserTokenArrayWithBalance[tokenName] ||
        state.data.currentUserTokenArrayWithBalance[tokenName]?.amount ===
          tokenBalance
      ) {
        // If the token is not present or the balance is the same, return without making any changes
        return;
      }

      // Create a copy of the current user's token array with balance for modification
      const updatedTokenArrayWithBalance = {
        ...state.data.currentUserTokenArrayWithBalance,
        [tokenName]: {
          ...state.data.currentUserTokenArrayWithBalance[tokenName],
          amount: tokenBalance,
        },
      };

      // Update the current user's token array with balance in the state
      state.data.currentUserTokenArrayWithBalance =
        updatedTokenArrayWithBalance;

      // Recalculate the total balance based on the updated token array with balance
      state.data.totalBalance = calculateTotalBalance(
        updatedTokenArrayWithBalance,
      );

      // Recalculate the total USD balance based on the updated token array with balance
      state.data.totalUSDBalance = calculateTotalUSDBalance(
        updatedTokenArrayWithBalance,
      );

      // Update the selected token in the state if it matches the updated token
      state.data.currentSelectedToken = updateSelectedToken(
        state.data.currentSelectedToken,
        tokenName,
        tokenBalance,
      );
    },

    /**
     * Updates the balances for multiple tokens in batch, recalculates total balances,
     * and updates the selected token if it is among the updated tokens.
     * @param state - The current Redux state.
     * @param action - Payload action containing an array of TokenBalanceFormatted objects.
     *                Example: [{ tokenName: 'ABC', tokenBalance: '123.45' }, ...]
     */
    updateBalanceInBatch: (
      state,
      action: PayloadAction<TokenBalanceFormatted[]>,
    ) => {
      // Create a copy of the current user's token array with balance for modification
      const temp = { ...state.data.currentUserTokenArrayWithBalance };

      // Iterate through the array of updated token balances
      action.payload.forEach(item => {
        // Destructure item properties for easier access
        const { tokenName, tokenBalance } = item || {};

        // Check if the token is present in the current user's token array with balance
        // and if the token balance is different from the new balance
        if (!temp[tokenName] || temp[tokenName].amount === tokenBalance) {
          // If the token is not present or the balance is the same, return without making any changes
          return;
        }

        // Update the token balance in the temporary token array with balance
        temp[tokenName] = {
          ...temp[tokenName],
          amount: tokenBalance,
        };

        // Update the selected token in the state if it matches the updated token
        state.data.currentSelectedToken = updateSelectedToken(
          state.data.currentSelectedToken,
          tokenName,
          tokenBalance,
        );
      });

      // Recalculate the total balance based on the updated token array with balance
      state.data.totalBalance = calculateTotalBalance(temp);

      // Recalculate the total USD balance based on the updated token array with balance
      state.data.totalUSDBalance = calculateTotalUSDBalance(temp);

      // Update the current user's token array with balance in the state
      state.data.currentUserTokenArrayWithBalance = temp;
    },

    /**
     * Updates the USD rate for a specific token and recalculates the total USD balance.
     * @param state - The current Redux state.
     * @param action - Payload action containing the tokenName and tokenUSDPrice.
     *                Example: { tokenName: 'ETH', tokenUSDPrice: '1.23' }
     */
    updateUSDRate: (
      state,
      action: PayloadAction<{ tokenName: string; tokenUSDPrice: string }>,
    ) => {
      // Destructure payload properties for easier access
      const { tokenName, tokenUSDPrice } = action.payload || {};

      // Check if the token is present in the current user's token array with balance
      // and if the USD amount is different from the new USD price
      if (
        !state.data.currentUserTokenArrayWithBalance[tokenName] ||
        state.data.currentUserTokenArrayWithBalance[tokenName].usdAmount ===
          tokenUSDPrice
      ) {
        // If the token is not present or the USD amount is the same, return without making any changes
        return;
      }

      // Create a copy of the current user's token array with balance for modification
      const updatedTokenArrayWithBalance = {
        ...state.data.currentUserTokenArrayWithBalance,
        [tokenName]: {
          ...state.data.currentUserTokenArrayWithBalance[tokenName],
          usdAmount: tokenUSDPrice,
        },
      };

      // Update the current user's token array with balance
      state.data.currentUserTokenArrayWithBalance =
        updatedTokenArrayWithBalance;

      // Update the specific token's USD amount in the state
      state.data.currentUserTokenArrayWithBalance[action.payload?.tokenName] = {
        ...state.data.currentUserTokenArrayWithBalance[
          action.payload?.tokenName
        ],
        usdAmount: action.payload?.tokenUSDPrice,
      };

      // Recalculate the total USD balance based on the updated token array with balance
      state.data.totalUSDBalance = calculateTotalUSDBalance(
        updatedTokenArrayWithBalance,
      );
    },

    getTotalBalance: state => {
      state.data.totalBalance =
        Object.values(state.data.currentUserTokenArrayWithBalance).reduce(
          (accumulator: number, token) => {
            return accumulator + parseTokenBalance(token.amount);
          },
          0,
        ) + '';
      state.data.totalUSDBalance =
        Object.values(state.data.currentUserTokenArrayWithBalance).reduce(
          (accumulator: number, token) => {
            return (
              accumulator +
              parseTokenBalance(token.amount) * parseFloat(token.usdAmount)
            );
          },
          0,
        ) + '';
    },

    resetTotalBalance: state => {
      state.data.totalBalance = '';
      state.data.totalUSDBalance = '0';
    },

    /**
     * Sets or toggles the 'isFavorite' property of a token for the current user and updates the selected token.
     * @param state - The current Redux state.
     * @param action - Payload action containing the shortName of the token.
     *                Example: { shortName: 'ABC' }
     */
    setTokenAsFavorite: (
      state,
      action: PayloadAction<{ shortName: string }>,
    ) => {
      // Toggle the 'isFavorite' property for the specified token in the current user's token array with balance
      state.data.currentUserTokenArrayWithBalance[action.payload.shortName] = {
        ...state.data.currentUserTokenArrayWithBalance[
          action.payload.shortName
        ],
        isFavorite:
          !state.data.currentUserTokenArrayWithBalance[action.payload.shortName]
            .isFavorite,
      };

      // Update the 'isFavorite' property for the selected token in the state
      state.data.currentSelectedToken = {
        ...state.data.currentSelectedToken,
        isFavorite:
          state.data.currentUserTokenArrayWithBalance[action.payload.shortName]
            .isFavorite,
      };

      state.data.tokenArrayWithBalance[action.meta.currentUserId] =
        state.data.currentUserTokenArrayWithBalance;
    },

    /**
     * Adds or removes a token from the selected tokens list, token array with balance, and tokens list.
     * @param state - The current Redux state.
     * @param action - Payload action containing the token object.
     *                Example: { token: { shortName: 'ABC', isCustom: true, ... } }
     */
    addRemoveTokenFromList: (
      state,
      action: PayloadAction<{ token: ExistingNetworksItem }>,
    ) => {
      // Extract token properties from the payload
      const tokenObj = action.payload?.token;
      const { shortName, isCustom, tokenType } = tokenObj;

      // Check if the token is already in the selected tokens list for the current user
      if (
        state.data.selectedTokensList[action.meta.currentUserId]?.includes(
          shortName,
        )
      ) {
        // Remove the token from token array with balance
        delete state.data.tokenArrayWithBalance[action.meta.currentUserId][
          shortName
        ];

        // Remove the token from current user's token array with balance
        delete state.data.currentUserTokenArrayWithBalance[shortName];

        // Update selected tokens list by removing the token
        state.data.selectedTokensList[action.meta.currentUserId] =
          state.data.selectedTokensList[action.meta.currentUserId].filter(
            tokenShortName => tokenShortName !== shortName,
          );

        // If the token is custom, remove it from the tokens list
        if (isCustom) {
          delete state.data.tokensList[shortName];
        }
      } else {
        // Generate a random ID for the token
        const id = generateRandomString(5);

        // Check if the token is custom or not for further handling
        if (isCustom) {
          // Add the token to token array with balance for the current user
          state.data.tokenArrayWithBalance[action.meta.currentUserId] = {
            ...state.data.tokenArrayWithBalance[action.meta.currentUserId],
            [shortName]: {
              ...tokenObj,
              isUpdated: false,
              id: tokenObj?.id ? tokenObj?.id : id,
              envType: state.data.networkEnvironment,
            },
          };

          // Update current user's token array with balance
          state.data.currentUserTokenArrayWithBalance =
            state.data.tokenArrayWithBalance[action.meta.currentUserId];
        } else {
          // Add the token to token array with balance for the current user
          state.data.tokenArrayWithBalance[action.meta.currentUserId] = {
            ...state.data.tokenArrayWithBalance[action.meta.currentUserId],
            [shortName]: {
              ...tokenObj,
              isUpdated: false,
              id: tokenObj?.id ? tokenObj?.id : id,
              envType: state.data.networkEnvironment,
              ...networksURLList[tokenObj?.networkId][
                state.data.networkEnvironment
              ],
            },
          };

          // Update current user's token array with balance
          state.data.currentUserTokenArrayWithBalance =
            state.data.tokenArrayWithBalance[action.meta.currentUserId];
        }

        // Check if selectedTokensList is already initialized
        if (Object.keys(state.data.selectedTokensList).length > 0) {
          // Check if the selected tokens list for the current user is already initialized
          if (state.data.selectedTokensList[action.meta.currentUserId]) {
            // Add the token to the selected tokens list for the current user
            state.data.selectedTokensList[action.meta.currentUserId].push(
              shortName,
            );
          } else {
            // Initialize the selected tokens list for the current user
            state.data.selectedTokensList = {
              ...state.data.selectedTokensList,
              [action.meta.currentUserId]: [shortName],
            };
          }
        } else {
          // Initialize the selected tokens list with the token for the current user
          state.data.selectedTokensList = {
            [action.meta.currentUserId]: [shortName],
          };
        }

        // If the token is custom, add it to the tokens list
        if (isCustom && tokenType === 'Native') {
          state.data.tokensList = {
            ...state.data.tokensList,
            [shortName]: {
              ...tokenObj,
              isUpdated: false,
              id: tokenObj?.id ? tokenObj?.id : id,
            },
          };
        }
      }
    },

    /**
     * Hides a token from the selected tokens list, token array with balance, and tokens list.
     * @param state - The current Redux state.
     * @param action - Payload action containing the token object.
     *                Example: { token: { networkId: 'net123', tokenType: 'Custom', shortName: 'ABC', isCustom: true } }
     */
    hideTokenFromList: (
      state,
      action: PayloadAction<{ token: ExistingNetworksItem }>,
    ) => {
      // Destructure token properties from the payload
      const { networkId, tokenType, shortName, isCustom } =
        action.payload?.token;

      // Check if the token is in the selected tokens list for the current user
      if (
        state.data.selectedTokensList[action.meta.currentUserId].includes(
          shortName,
        )
      ) {
        // Check token type for further handling
        if (tokenType === 'Native') {
          if (isCustom) {
            for (const userId in state.data.tokenArrayWithBalance) {
              const itemObj =
                state.data.tokenArrayWithBalance[userId][shortName];
              if (itemObj?.networkId === networkId) {
                // Remove token from token array with balance
                delete state.data.tokenArrayWithBalance[userId][shortName];
                // Remove token from current user's token array with balance
                delete state.data.currentUserTokenArrayWithBalance[shortName];
              }
            }
          }
          // Iterate through Native tokens to remove the specified token
          for (const item of Object.values(
            state.data.tokenArrayWithBalance[action.meta.currentUserId],
          )) {
            if (item.networkId === networkId) {
              // Remove token from token array with balance
              delete state.data.tokenArrayWithBalance[
                action.meta.currentUserId
              ][item.shortName];

              // Remove token from current user's token array with balance
              delete state.data.currentUserTokenArrayWithBalance[
                item.shortName
              ];

              // Update selected tokens list by removing the token
              state.data.selectedTokensList[action.meta.currentUserId] =
                state.data.selectedTokensList[action.meta.currentUserId].filter(
                  tokenShortName => tokenShortName !== item.shortName,
                );

              state.data.shouldRefetchAllBalanceAndStartBalanceChangeObservers =
                !state.data
                  .shouldRefetchAllBalanceAndStartBalanceChangeObservers;
            }
          }
        } else {
          // Remove token from token array with balance
          delete state.data.tokenArrayWithBalance[action.meta.currentUserId][
            shortName
          ];

          // Remove token from current user's token array with balance
          delete state.data.currentUserTokenArrayWithBalance[shortName];

          // Update selected tokens list by removing the token
          state.data.selectedTokensList[action.meta.currentUserId] =
            state.data.selectedTokensList[action.meta.currentUserId].filter(
              tokenShortName => tokenShortName !== shortName,
            );

          state.data.shouldRefetchAllBalanceAndStartBalanceChangeObservers =
            !state.data.shouldRefetchAllBalanceAndStartBalanceChangeObservers;
        }

        // If the token is custom, remove it from the tokens list
        if (isCustom) {
          delete state.data.tokensList[shortName];
          state.data.shouldRefetchAllBalanceAndStartBalanceChangeObservers =
            !state.data.shouldRefetchAllBalanceAndStartBalanceChangeObservers;
        }
      }
    },

    /**
     * Sets the current selected token by its ID, clears activity-related state,
     * and updates the current selected token in the state.
     * @param state - The current Redux state.
     * @param action - Payload action containing the tokenId.
     *                Example: { tokenId: '1' }
     */
    setCurrentSelectedTokenById: (
      state,
      action: PayloadAction<{ tokenId: string }>,
    ) => {
      // Retrieve the selected token object based on the provided tokenId
      const selectedTokenObj =
        state.data.currentUserTokenArrayWithBalance[action?.payload.tokenId];

      // Clear activity-related state
      state.data.activityList = [];
      state.data.activityTransactionInfo = undefined;
      state.errorActivityTransactionInfo = '';
      state.errorActivityList = '';
      state.loaderActivityList = false;

      // Update the current selected token in the state
      state.data.currentSelectedToken = selectedTokenObj;
    },

    clearActivityTransactionInfo: state => {
      state.data.activityTransactionInfo = undefined;
      state.errorActivityTransactionInfo = '';
    },

    /**
     * Clears selected tokens list, token array with balance, and wallet address.
     * Resets tokens list to default values based on the current network environment.
     * @param state - The current Redux state.
     */
    clearSelectedTokensList: state => {
      // Clear selected tokens list
      state.data.selectedTokensList = {};

      // Clear token array with balance
      state.data.tokenArrayWithBalance = {};

      // Clear wallet address
      state.data.walletAddress = {};

      // Create a copy of the default tokens list for modification
      const tempTokenObjList = { ...mockData.networksListArray };

      // Iterate through the default tokens list to update values based on the current environment
      for (const item of Object.values(mockData.networksListArray)) {
        tempTokenObjList[item.shortName] = {
          ...item,
          ...networksURLList[item?.networkId][state.data.networkEnvironment],
        };
      }

      // Update the tokens list in the state
      state.data.tokensList = tempTokenObjList;
    },

    //update activity list item with updated status and update info in details page also
    //update transaction status for activity details page transactionStatus 1 for Success, 2 for pending, 3 for Failed
    updateTokenTransactionDetails: (state, action) => {
      const txtList = state.data.activityList?.filter(
        obj => obj?.id !== action.payload?.id,
      );

      state.data.activityList = [action.payload, ...txtList];
      state.data.activityTransactionInfo = action.payload;
    },

    updateSelectedNetworkFilter: (state, action) => {
      state.selectedNetworkFilter = action.payload.data;
    },

    /**
     * Updates the network environment and resets balances for Native tokens accordingly.
     * @param state - The current Redux state.
     * @param action - Payload action containing the new environment type.
     *                Example: { envType: 'production' }
     */
    updateNetworkEnvironment: (
      state,
      action: PayloadAction<{ envType: EnvironmentType }>,
    ) => {
      // Extract the current user's token array with balance
      const tempTokenList = Object.values(
        state.data.currentUserTokenArrayWithBalance,
      );

      // Create a copy of the current user's token array with balance for modification
      const tempTokenObjList = {
        ...state.data.currentUserTokenArrayWithBalance,
      };

      // Iterate through the token list to update Native tokens with default values
      for (const item of tempTokenList) {
        if (!item?.isCustom && item?.tokenType === 'Native') {
          // Update Native tokens with default values based on the new environment type
          tempTokenObjList[item?.shortName] = {
            ...item,
            amount: '0.0',
            ...networksURLList[item?.networkId][action.payload?.envType],
            envType: action.payload?.envType,
          };
        }
      }

      // Update the token array with balance for the current user in the state
      state.data.tokenArrayWithBalance[action.meta.currentUserId] =
        tempTokenObjList;

      // Update the current user's token array with balance
      state.data.currentUserTokenArrayWithBalance = tempTokenObjList;

      // Update the network environment in the state
      state.data.networkEnvironment = action.payload?.envType;
    },

    /**
     * Updates the token array with balance for the current user's network list.
     * @param state - The current Redux state.
     * @param action - Payload action containing the userId.
     *                Example: { userId: 'user123' }
     */
    updateCurrentUserNetworkList: (
      state,
      action: PayloadAction<{ userId: string }>,
    ) => {
      // Extract the token array with balance for the specified user
      const tempTokenList = Object.values(
        state.data.tokenArrayWithBalance[action.payload.userId],
      );

      // Create a copy of the token array with balance for modification
      const tempTokenObjList = {
        ...state.data.tokenArrayWithBalance[action.payload.userId],
      };

      // Iterate through the token list to update Native tokens with default values
      for (const item of tempTokenList) {
        if (!item?.isCustom && item?.tokenType === 'Native') {
          // Update Native tokens with default values
          tempTokenObjList[item?.shortName] = {
            ...item,
            amount: '0.0',
            ...networksURLList[item?.networkId][state.data.networkEnvironment],
            envType: state.data.networkEnvironment,
          };
        }
      }

      // Update the token array with balance in the state
      state.data.tokenArrayWithBalance[action.payload.userId] =
        tempTokenObjList;

      // Update the current user's token array with balance
      state.data.currentUserTokenArrayWithBalance = tempTokenObjList;

      // Trigger a change to indicate that all balances should be refetched
      state.data.shouldRefetchAllBalanceAndStartBalanceChangeObservers =
        !state.data.shouldRefetchAllBalanceAndStartBalanceChangeObservers;

      // Reset the selected network filter to null
      state.selectedNetworkFilter = null;
    },

    /**
     * Removes user-specific token data from the state.
     * @param state - The current Redux state.
     * @param action - Payload action containing the userId to remove.
     *                Example: { removeUserId: 'user123' }
     */
    hideUserTokenData: (
      state,
      action: PayloadAction<{
        removeUserId: string;
      }>,
    ) => {
      // Remove wallet address associated with the user
      delete state.data.walletAddress[action.payload.removeUserId];

      // Remove token array with balance for the user
      delete state.data.tokenArrayWithBalance[action.payload.removeUserId];

      // Remove selected tokens list for the user
      delete state.data.selectedTokensList[action.payload.removeUserId];
    },

    resetWalletInfo: () => initialState,
  },

  extraReducers: builder => {
    builder.addCase(getAllTokenBalanceAndStartObservers.pending, _state => {});

    // getTokenActivityListFetch
    builder.addCase(getTokenActivityListFetch.pending, state => {
      state.data.activityListFooterLoader = true;
      state.loaderActivityList = true;
      state.errorActivityList = '';
    });

    builder.addCase(getTokenActivityListFetch.fulfilled, (state, action) => {
      state.data.activityListFooterLoader = false;
      state.loaderActivityList = false;
      if (action.payload?.data) {
        if (action.payload?.data?.length > 0) {
          if (action.payload?.isNativeToken) {
            const txtList = action.payload?.data?.filter(
              obj => obj?.functionName === '',
            );
            let tempList = [];
            for (let obj in txtList) {
              const temp = {
                ...txtList[obj],
                ...{
                  id:
                    state.data.walletAddress[action.meta.currentUserId][
                      state.data.currentSelectedToken?.isEVMNetwork
                        ? defaultNetwork
                        : state.data.currentSelectedToken?.networkName
                    ]?.address?.toLowerCase() ===
                    txtList[obj].from?.toLowerCase()
                      ? '1'
                      : '2',
                },
              };
              tempList.push(temp);
            }

            if (state.data.activityList?.length > 0) {
              state.data.activityList =
                state.data.activityList?.concat(tempList);
            } else {
              state.data.activityList = tempList;
            }
          } else {
            const txtList = action.payload?.data;
            let tempList = [];
            for (let obj in txtList) {
              const temp = {
                ...txtList[obj],
                ...{
                  id:
                    state.data.walletAddress[action.meta.currentUserId][
                      state.data.currentSelectedToken?.isEVMNetwork
                        ? defaultNetwork
                        : state.data.currentSelectedToken?.networkName
                    ]?.address?.toLowerCase() ===
                    txtList[obj].from?.toLowerCase()
                      ? '1'
                      : '2',
                },
              };
              tempList.push(temp);
            }
            if (state.data.activityList?.length > 0) {
              state.data.activityList =
                state.data.activityList?.concat(tempList);
            } else {
              state.data.activityList = tempList;
            }
          }
        } else {
          state.errorActivityList = t('wallet:no_activities_yet');
        }
      }
    });

    builder.addCase(getTokenActivityListFetch.rejected, state => {
      state.loaderActivityList = false;
      state.errorActivityList = t('wallet:no_activities_yet');
    });

    // getTokenTransactionDetailsFetch
    builder.addCase(getTokenTransactionDetailsFetch.pending, state => {
      state.errorActivityTransactionInfo = '';
    });

    builder.addCase(
      getTokenTransactionDetailsFetch.fulfilled,
      (state, action) => {
        if (action.payload?.length > 0) {
          state.data.activityTransactionInfo = action.payload[0];
        } else {
          state.errorActivityTransactionInfo = t(
            'wallet:no_activities_details_found',
          );
        }
      },
    );

    builder.addCase(getTokenTransactionDetailsFetch.rejected, state => {
      state.errorActivityTransactionInfo = t(
        'wallet:no_activities_details_found',
      );
    });

    //getEVMNativeTokenBalanceFetch
    builder.addCase(
      getEVMNativeTokenBalanceFetch.fulfilled,
      (state, action) => {
        const temp = {
          ...state.data.currentUserTokenArrayWithBalance,
        };
        if (
          temp[action.payload?.shortName]?.amount === action.payload?.balance ||
          !temp.hasOwnProperty(action.payload?.shortName)
        ) {
          return;
        }

        temp[action.payload?.shortName] = {
          ...temp[action.payload?.shortName],
          amount: action.payload?.balance,
        };

        if (
          action.payload?.shortName ===
          state.data.currentSelectedToken?.shortName
        ) {
          state.data.currentSelectedToken = {
            ...state.data.currentSelectedToken,
            amount: action.payload?.balance,
          };
        }
        state.data.totalBalance =
          Object.values(temp).reduce((accumulator: number, token) => {
            return accumulator + parseTokenBalance(token.amount);
          }, 0) + '';

        state.data.totalUSDBalance =
          Object.values(temp).reduce((accumulator: number, token) => {
            return (
              accumulator +
              parseTokenBalance(token.amount) * parseFloat(token.usdAmount)
            );
          }, 0) + '';

        state.data.currentUserTokenArrayWithBalance = temp;
      },
    );

    //getUSDPrice
    builder.addCase(getUSDPrice.fulfilled, (state, action) => {
      const temp = {
        ...state.data.currentUserTokenArrayWithBalance,
      };

      action.payload.forEach(item => {
        if (
          temp[item?.shortName]?.usdAmount === item.usdAmount ||
          !temp.hasOwnProperty(item?.shortName)
        ) {
          return;
        }

        temp[item?.shortName] = {
          ...temp[item?.shortName],
          usdAmount: item?.usdAmount,
          oneDayUSDPriceChangePercentage: item?.oneDayUSDPriceChangePercentage,
        };

        if (item?.shortName === state.data.currentSelectedToken?.shortName) {
          state.data.currentSelectedToken = {
            ...state.data.currentSelectedToken,
            usdAmount: item?.usdAmount,
            oneDayUSDPriceChangePercentage:
              item?.oneDayUSDPriceChangePercentage,
          };
        }
      });

      state.data.totalUSDBalance =
        Object.values(temp).reduce((accumulator: number, token) => {
          return (
            accumulator +
            parseTokenBalance(token.amount) * parseFloat(token.usdAmount)
          );
        }, 0) + '';

      state.data.currentUserTokenArrayWithBalance = temp;
    });
  },
});

const calculateTotalBalance = (tokenArray: {
  [key: string]: ExistingNetworksItem;
}) =>
  Object.values(tokenArray).reduce(
    (accumulator, token) => accumulator + parseTokenBalance(token.amount),
    0,
  ) + '';

const calculateTotalUSDBalance = (tokenArray: {
  [key: string]: ExistingNetworksItem;
}) =>
  Object.values(tokenArray).reduce(
    (accumulator, token) =>
      accumulator +
      parseTokenBalance(token.amount) * parseFloat(token.usdAmount),
    0,
  ) + '';

const updateSelectedToken = (
  currentSelectedToken: ExistingNetworksItem,
  tokenName: string,
  tokenBalance: string,
) =>
  tokenName === currentSelectedToken?.shortName
    ? { ...currentSelectedToken, amount: tokenBalance }
    : currentSelectedToken;

export const {
  updateWalletAddress,
  updateSeedPhrase,
  updatePrivateKey,
  resetWalletInfo,
  updateBalance,
  getTotalBalance,
  updateUSDRate,
  clearActivityTransactionInfo,
  setTokenAsFavorite,
  addRemoveTokenFromList,
  setCurrentSelectedTokenById,
  updateTokenTransactionDetails,
  clearSelectedTokensList,
  triggerFetchAllTokenBalanceAndStartObservers,
  resetTotalBalance,
  updateBalanceInBatch,
  hideTokenFromList,
  updateSelectedNetworkFilter,
  updateNetworkEnvironment,
  updateCurrentUserNetworkList,
  updateIsWalletFromSeedPhase,
  hideUserTokenData,
} = walletSlice.actions;
export default walletSlice.reducer;

// type WalletPayload = {
//   payload: Partial<WalletInfoState>;
// };
