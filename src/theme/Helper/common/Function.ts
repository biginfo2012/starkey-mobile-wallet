import { Alert } from 'react-native';
import crypto from 'react-native-quick-crypto';
import Toast from 'react-native-toast-message';

import dayjs from 'dayjs';
import { ethers } from 'ethers';
import { updateLoader } from 'store/loader';
import {
  hideNotifications,
  hidePopup,
  showNotifications,
  showPopup,
} from 'store/popupModelReducer';
import {
  GasPriceAlertPopUpItem,
  PopUpItem,
  TokenReceivePopUpItem,
} from 'types/applicationInterfaces';

import { CurrencyName, NetWorkType, defaultNetwork } from '../constant';

ethers.randomBytes.register(length => {
  return new Uint8Array(crypto.randomBytes(length));
});

ethers.computeHmac.register((algo, key, data) => {
  return crypto.createHmac(algo, key).update(data).digest();
});

ethers.pbkdf2.register((passwd, salt, iter, keylen, algo) => {
  return crypto.pbkdf2Sync(passwd, salt, iter, keylen, algo);
});

ethers.sha256.register(data => {
  return crypto.createHash('sha256').update(data).digest();
});

ethers.sha512.register(data => {
  return crypto.createHash('sha512').update(data).digest();
});

// This function filters an array of objects based on a given key, removing objects that have a blank value for that key.
export const filterObjectsWithBlankValue = (array: any[], key: string) => {
  return array.filter((obj: { [x: string]: string }) => obj[key] === '');
};

// Convert the tokenBalance string to a numeric value (remove commas)
export function parseTokenBalance(balanceStr: string): number {
  return parseFloat(balanceStr?.replace(/,/g, ''));
}

// Function to get the rounded decimal value of a number.
// If 'value' is provided, it parses it as a float, otherwise, it defaults to 0.
// It then rounds the number to 4 decimal places using the Math.round() method.
// This function helps in handling floating-point precision errors in calculations.
export const getRoundDecimalValue = (value?: any, decimal = 6) => {
  let tempValue = parseFloat(value ?? 0);
  let decimalValue = Math.pow(10, decimal);
  return Math.round((tempValue + Number.EPSILON) * decimalValue) / decimalValue;
};

// Function to format the provided 'balance' in Ether units.
// It uses the 'ethers.formatEther' method to convert the balance from wei to Ether.
// it will divide value by 10^18
export const formatEther = (balance: any) => {
  return ethers.formatEther(balance);
};

// Function to parse the provided 'balance' in Ether units.
// It uses the 'ethers.parseEther' method to convert the balance from Ether to wei.
// it will multiple value by 10^18
export const parseEther = (balance: any) => {
  return ethers.parseEther(balance);
};

export const parseUtils = (balance: any, decimal = 18) => {
  return ethers.parseUnits(balance, decimal);
};

// Function to format the provided 'balance' of an ERC-20 token.
// It uses the 'ethers.formatUnits' method to convert the balance from base units to token units,
// where 'decimal' parameter represents the number of decimal places for the token.
export const formatErc20Token = (balance: any, decimal = 6) => {
  return ethers.formatUnits(balance, decimal);
};

export const formatErc20TokenConvertNormal = (value: number, decimal = 6) => {
  return value * Math.pow(10, decimal);
};

// Format the price to USD using the locale, style, and currency.
export const USDollar = (digit = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CurrencyName,
    maximumFractionDigits: digit,
    minimumFractionDigits: 0,
  });

// This function generates a random sequence of numbers based on the specified length.
// It throws an error if the length exceeds 12.
export const generateRandomNumber = (length: number) => {
  if (length > 12) {
    throw new Error('Length cannot exceed 12');
  }

  let numbers = Array.from({ length: 12 }, (_, i) => i); // Create an array of numbers from 0 to 11
  let randomSequence = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const randomNumber = numbers.splice(randomIndex, 1)[0];
    randomSequence.push(randomNumber);
  }

  return randomSequence;
};

let store;
/*
Sets the global 'store' variable to the provided '_store'.
*/
export const injectStore = _store => {
  store = _store;
};

/*
show a ReceivedToken popup using hidePopup reducer
*/

export const showReceivedTokenModal = (param: TokenReceivePopUpItem) => {
  let data: PopUpItem;

  switch (param.type) {
    case 'tokenReceive':
      data = {
        isVisible: true,
        popupTitle: 'wallet:you_have_received',
        popupTitleValueParams: {
          amount: param.amount,
          token: param.symbol ?? '',
        },
        popupDescription: param.isExists
          ? ''
          : 'wallet:do_you_want_to_add_to_your_wallet',
        popupDescriptionValueParams: {
          token: param.symbol ?? '',
        },
        buttonOkText: param.isExists
          ? 'wallet:view_balance'
          : 'wallet:add_Token',
        okButtonType: 'primary',
        buttonCancelText: param.isExists ? 'common:ok' : 'wallet:not_now',
        onPressOk: param.onPressOk,
        onPressCancel: param.onPressCancel,
        iconPath: param.tokenObj.image,
      };
      break;
    case 'tokenSend':
      data = {
        isVisible: true,
        popupTitle: 'wallet:you_have_sent',
        popupTitleValueParams: {
          amount: param.amount,
          token: param.symbol ?? '',
        },
        popupDescription: '',
        popupDescriptionValueParams: {},
        buttonOkText: 'wallet:view_balance',
        okButtonType: 'primary',
        buttonCancelText: 'common:ok',
        onPressOk: param.onPressOk,
        onPressCancel: param.onPressCancel,
        iconPath: param.tokenObj.image,
      };
      break;
  }
  store.dispatch(showPopup(data));
};

export const showGasPriceAlertModal = (param: GasPriceAlertPopUpItem) => {
  let data: PopUpItem;

  switch (param.type) {
    case 'setGasPriceAlert':
      data = {
        isVisible: true,
        popupTitle: 'wallet:gas_price_is',
        popupTitleValueParams: {
          tokenWithAmount: param.tokenWithAmount,
          usdAmount: param.usdAmount ?? '',
        },
        popupDescription: 'wallet:time_to_make_transaction',
        popupDescriptionValueParams: {},
        buttonOkText: 'wallet:view_wallet',
        okButtonType: 'primary',
        buttonCancelText: 'wallet:not_now',
        onPressOk: param.onPressOk,
        onPressCancel: param.onPressCancel,
        iconPath: param.imagePath,
      };
      break;
  }
  store.dispatch(showPopup(data));
};

export const showConfirmationModal = (param: PopUpItem) => {
  store.dispatch(showPopup(param));
};

/*
hide a ReceivedToken popup using hidePopup reducer
*/
export const dismissReceivedTokenModal = () => {
  store.dispatch(hidePopup());
};

/*
show a toast notification using the 'Toast.show()' method. with dynamic params
*/
export const showToast = (
  type: 'success' | 'error' | 'info',
  text1: string,
  text2?: string,
) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2 ?? '',
    position: 'bottom',
    visibilityTime: 5000,
    onPress: hideToast,
  });
};

/*
Hides a toast notification using the 'Toast.hide()' method.
*/
export const hideToast = () => {
  Toast.hide();
};

export const toChecksumAddress = (address: string) => {
  if (!/^(0x)?[0-9A-Fa-f]{40}$/i.test(address)) {
    return false;
  }
  return true;
};

export const showAlert = (
  title: string,
  message: string,
  okBtnText?: string,
  onOkPress?: () => void,
  cancelBtnText?: string,
  onCancelPress?: () => void,
) => {
  Alert.alert(
    title,
    message,
    cancelBtnText
      ? [
          {
            text: okBtnText,
            onPress: onOkPress,
          },
          {
            text: cancelBtnText,
            onPress: onCancelPress,
          },
        ]
      : [
          {
            text: okBtnText,
            onPress: onOkPress,
          },
        ],
  );
};

export const dateTimeConvert = (timeStamp: number) => {
  if (timeStamp) {
    if (dayjs(timeStamp * 1000).format('DD MMM') === dayjs().format('DD MMM')) {
      return 'Today' + dayjs(timeStamp * 1000).format(' h:mm A');
    }
    let time = dayjs(timeStamp * 1000).format('MMM. DD tt h:mm A');
    return time.replace('tt', 'at');
  } else {
    return '';
  }
};

export const getImageFromToken = (tokenName: string) => {
  const tokenObj = store.getState()?.wallet.data.tokensList[tokenName];
  return tokenObj;
};

export const checkTokenIsExists = (tokenName: string) => {
  let isExists = false;

  const tokenObj =
    store.getState()?.wallet.data.currentUserTokenArrayWithBalance[tokenName];

  isExists = tokenObj ? true : false;
  return isExists;
};

export const stopLoader = () => {
  store.dispatch(
    updateLoader({
      isLoading: false,
    }),
  );
};

export const getWalletAddress = (
  networkName: string,
  isEVMNetwork?: boolean,
  userId?: string,
) => {
  const strUserName = userId
    ? userId
    : store.getState().userInfo?.data?.currentUserId;
  if (
    store.getState().wallet?.data?.walletAddress?.hasOwnProperty(strUserName) &&
    networkName !== ''
  ) {
    return store.getState().wallet?.data?.walletAddress[strUserName][
      isEVMNetwork ? defaultNetwork : networkName
    ]?.address;
  } else {
    return;
  }
};

export const findValueByKey = (obj: any, key: string): any => {
  // Base case: if the current object has the key, return its value
  if (obj[key]) {
    return obj[key];
  }
  // Recursive case: iterate through all keys and recursively call the function if a nested object is found
  for (let k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      const foundValue = findValueByKey(obj[k], key);
      if (foundValue) {
        return foundValue;
      }
    }
  }
  // If the key is not found, return null or handle it as required
  return null;
};

/*
show a notification popup using showNotificationPopup reducer
*/
export const showNotificationList = (param: PopUpItem) => {
  store.dispatch(showNotifications(param));
};

/*
hide a notification popup using hideNotificationPopup reducer
*/
export const hideNotificationList = () => {
  store.dispatch(hideNotifications());
};

// Function to generate a random string of a specified length
export const generateRandomString = (length: number): string => {
  // Define the characters that can be used in the random string
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // Initialize an empty string to store the result
  let result = '';

  // Iterate 'length' times to generate the random string
  for (let i = 0; i < length; i++) {
    // Generate a random index to pick a character from the 'characters' string
    const randomIndex = Math.floor(Math.random() * characters.length);
    // Append the selected character to the result string
    result += characters.charAt(randomIndex);
  }

  // Return the generated random string
  return result;
};

export const getUserDataFromAddress = (address: string, userId?: string) => {
  const walletAddress = store.getState()?.wallet.data.walletAddress;

  const foundUser = Object.keys(walletAddress).find(strUserId =>
    Object.keys(walletAddress[strUserId]).some(
      network =>
        walletAddress[strUserId][network].address.toLowerCase() ===
        address.toLowerCase(),
    ),
  );

  if (foundUser) {
    return getUserDataFromUserList(userId ? userId : foundUser);
  }

  return getUsernameFromAddressBook(address);
};

export const getUsernameFromAddressBook = (address: string) => {
  const filterUserList = store
    .getState()
    ?.addressBook.addressBookList.filter(
      item => item.address?.toLowerCase() === address?.toLowerCase(),
    );
  return filterUserList?.length ? filterUserList[0] : {};
};

export const getUserDataFromUserList = (userId: string) => {
  const filterUserList = store
    .getState()
    .userInfo?.data?.usersData.filter(item => item.userId === userId);

  const filterImportUserList = store
    .getState()
    .userInfo?.data?.importedUsersData.filter(item => item.userId === userId);

  return filterUserList?.length
    ? filterUserList[0]
    : filterImportUserList?.length
    ? filterImportUserList[0]
    : {};
};

/**
 * Generates a random index within the range [0, max).
 * @param {number} max - The upper bound for the random index.
 * @returns {number} - The randomly generated index.
 */
export const getRandomIndex = (max: number) => {
  if (max > 0) {
    return Math.floor(Math.random() * max);
  }
};

export const getMinimumBalance = (networkType: string) => {
  switch (networkType) {
    case NetWorkType.SOL:
      return 0.00089;
    case NetWorkType.SUI:
      return 0.01;
    default:
      return 0;
  }
};

/**
 * Color palette array containing arrays of two color codes.
 * @type {string[][]}
 */
export const colorPalette: string[][] = [
  ['#FFD3A5', '#FD6585'],
  ['#0F3443', '#34E89E'],
  ['#12C2E9', '#F64F59'],
  ['#FCCF31', '#F55555'],
  ['#7F7FD5', '#91EAE4'],
  ['#3E5151', '#DECBA4'],
  ['#333399', '#FF00CC'],
  ['#31B7C2', '#7BC393'],
  ['#2193b0', '#6dd5ed'],
  ['#ee9ca7', '#ffdde1'],
  ['#de6262', '#ffb88c'],
  ['#06beb6', '#48b1bf'],
  ['#02aab0', '#00cdac'],
  ['#AB91C5', '#DC5356'],
  ['#F0CB69', '#DC5356'],
  ['#833ab4', '#fd1d1d', '#fcb045'],
  ['#f7ba2c', '#ea5459'],
  ['#61f4de', '#6e78ff'],
  ['#e62314', '#f19e18'],
  ['#00ff87', '#60efff'],
  ['#ff0f7b', '#f89b29'],
  ['#fbc2eb', '#a6c1ee'],
  ['#43e97b', '#38f9d7'],
  ['#2af598', '#009efd'],
  ['#37ecba', '#72afd3'],
];
