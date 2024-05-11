import { createSlice } from '@reduxjs/toolkit';
import { PopUpItem } from 'types/applicationInterfaces';

interface popupModelDataType {
  data: PopUpItem;
  notificationData: any;
}

const initialState: popupModelDataType = {
  data: {
    popupTitle: '',
    popupDescription: '',
    buttonOkText: '',
    okButtonType: 'primary',
    buttonCancelText: '',
    iconPath: null,
    imagePath: null,
    seconds: '',
    amount: '',
    usdAmount: '',
    tokenType: '',
  },
  notificationData: {
    isVisible: false,
    onPressClose: null,
  },
};

const popupModelReducer = createSlice({
  name: 'popupModelReducer',
  initialState,
  reducers: {
    showPopup: (state, action) => {
      state.data = action.payload;
    },
    hidePopup: state => {
      state.data.isVisible = false;
    },
    showNotifications: (state, action) => {
      state.notificationData = action.payload;
    },
    hideNotifications: state => {
      state.notificationData.isVisible = false;
    },
  },
});

export const { showPopup, hidePopup, showNotifications, hideNotifications } =
  popupModelReducer.actions;
export default popupModelReducer.reducer;
