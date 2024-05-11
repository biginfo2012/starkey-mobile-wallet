import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserResponse } from 'types/apiResponseInterfaces';
import { SettingConfig } from 'types/applicationInterfaces';

interface UserState {
  data: {
    token: string;
    usersData: UserResponse[];
    userName: string;
    currentUserId: string;
    currentUser: UserResponse;
    config: SettingConfig;
    importedUsersData: UserResponse[];
  };
}

const initialState: UserState = {
  data: {
    token: '',
    userData: [],
    userName: '',
    currentUserId: '',
    currentUser: {},
    importedUsersData: [],
    config: {
      isFaceIdEnabled: false,
      isFaceIdEnabledForTransaction: false,
      shouldHideTokenBalance: false,
      isAnalyticsEnable: false,
      currency: 'USD',
      language: 'EN',
      shouldHideAccountBalance: false,
      isSetupFileRecovery: false,
      autoLockTimer: 0,
    },
  },
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    updateUserToken: (
      state,
      action: PayloadAction<{ data: { token: string } }>,
    ) => {
      state.data.token = action.payload.data?.token;
    },

    updateSettingConfig: (
      state,
      action: PayloadAction<{ config: Partial<SettingConfig> }>,
    ) => {
      state.data.config = { ...state.data.config, ...action.payload?.config };
    },

    updateCreateUser: (
      state,
      action: PayloadAction<{ data: UserResponse[] }>,
    ) => {
      state.data.usersData = action.payload.data;
    },

    updateImportedUsersData: (
      state,
      action: PayloadAction<{ data: UserResponse[] }>,
    ) => {
      state.data.importedUsersData = action.payload.data;
    },

    updateUserName: (
      state,
      action: PayloadAction<{ data: { userName: string } }>,
    ) => {
      state.data.userName = action.payload.data?.userName;
    },

    updateCurrentUserId: (
      state,
      action: PayloadAction<{ data: { userId: string } }>,
    ) => {
      state.data.currentUserId = action.payload.data?.userId;
    },

    updateCurrentUser: (
      state,
      action: PayloadAction<{ data: UserResponse }>,
    ) => {
      state.data.currentUser = action.payload.data;
    },

    /**
     * Hides a user by removing their data from both usersData and importedUsersData lists.
     * If the user being hidden is the current user, updates the currentUser and currentUserId in the state.
     * @param state - The current Redux state.
     * @param action - Payload action containing removeUserId.
     *                Example: { removeUserId: 'user123' }
     */
    hideUser: (state, action: PayloadAction<{ removeUserId: string }>) => {
      // Destructure payload properties for easier access
      const { removeUserId } = action.payload;

      // Filter out the user with the specified userId from usersData
      state.data.usersData = state.data.usersData.filter(
        item => item.userId !== removeUserId,
      );

      // Filter out the user with the specified userId from importedUsersData
      state.data.importedUsersData = state.data.importedUsersData.filter(
        item => item.userId !== removeUserId,
      );

      // Check if the current user being hidden user
      if (state.data.currentUser.userId === removeUserId) {
        // Find the primary user (first user) in the updated usersData list
        const primaryUser = state.data.usersData[0];

        // Update the currentUser and currentUserId in the state to the primary user
        state.data.currentUser = primaryUser;
        state.data.currentUserId = primaryUser.userId;
      }
    },

    /**
     * Edits user data, including userName and profileIcon, in the Redux state.
     * @param state - The current Redux state.
     * @param action - Payload action containing userId, userName, and profileIcon.
     *                Example: { userId: 'user123', userName: 'John Doe', profileIcon: 'avatar.png' }
     */
    editUserData: (
      state,
      action: PayloadAction<{
        userId: string;
        userName: string;
        profileIcon: string | string[];
      }>,
    ) => {
      // Destructure payload properties for easier access
      const { userId, userName, profileIcon } = action.payload;

      // Function to update user data in a given user list
      const updateUserList = (userList: UserResponse[]) => {
        // Find the index of the user with the specified userId in the user list
        const userIndex = userList.findIndex(user => user.userId === userId);

        // If the user with the specified userId is found in the list
        if (userIndex !== -1) {
          // Update the userName and profileIcon for the user
          userList[userIndex].userName = userName;
          userList[userIndex].profileIcon = profileIcon;
        }
      };

      // Update user data in both usersData and importedUsersData lists
      updateUserList(state.data.usersData);
      updateUserList(state.data.importedUsersData);

      // If the current user being edited then update the currentUser in the state
      if (state.data.currentUserId === userId) {
        // Filter the user data for the current user in both user lists
        const tempUserList = state.data.usersData.filter(
          itemObj => itemObj.userId === userId,
        );
        const tempImportList = state.data.importedUsersData.filter(
          itemObj => itemObj.userId === userId,
        );

        // Update the currentUser in the state based on the found user data
        state.data.currentUser = tempImportList?.length
          ? tempImportList[0]
          : tempUserList[0];
      }
    },

    resetUserInfo: () => initialState,
  },
});

export const {
  updateUserToken,
  resetUserInfo,
  updateSettingConfig,
  updateCreateUser,
  updateUserName,
  updateCurrentUser,
  updateImportedUsersData,
  hideUser,
  updateCurrentUserId,
  editUserData,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
