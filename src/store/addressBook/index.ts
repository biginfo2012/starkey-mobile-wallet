import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AddressItem, RecentTrnAddressItem } from 'types/applicationInterfaces';

interface AddressBookInfoState {
  addressBookList: AddressItem[];
  recentTransactionAddressList: {
    [key: string]: { [key: string]: RecentTrnAddressItem[] };
  };
}

const initialState: AddressBookInfoState = {
  addressBookList: [],
  recentTransactionAddressList: {},
};

const addressBookSlice = createSlice({
  name: 'addressBook',
  initialState,
  reducers: {
    storeAddressInBook: (
      state,
      action: PayloadAction<{ data: AddressItem }>,
    ) => {
      state.addressBookList.push(action.payload.data);
    },

    removeAddressFromBook: (
      state,
      action: PayloadAction<{ data: AddressItem }>,
    ) => {
      state.addressBookList = state.addressBookList.filter(
        item => item.address !== action.payload.data.address,
      );
    },

    storeRecentTransactionAddress: (
      state,
      action: PayloadAction<{ data: RecentTrnAddressItem }>,
    ) => {
      const { userId, networkShortName, address } = action.payload.data;
      const userData = state.recentTransactionAddressList[userId] || {};
      const transactionsList = userData[networkShortName] || [];

      if (transactionsList.every(obj => obj.address !== address)) {
        if (transactionsList.length === 3) {
          transactionsList.pop();
        }

        state.recentTransactionAddressList[userId] = {
          ...userData,
          [networkShortName]: [action.payload.data, ...transactionsList],
        };
      }
    },

    resetAddressBookInfo: () => initialState,
  },
});

export const {
  storeAddressInBook,
  removeAddressFromBook,
  storeRecentTransactionAddress,
} = addressBookSlice.actions;

export default addressBookSlice.reducer;
