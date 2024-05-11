import React from 'react';

import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {
  ActivityDetails,
  AddAddress,
  AddNetwork,
  AddToken,
  AddressBook,
  ChooseNetwork,
  GasPriceAlert,
  NetworkFilter,
  ReceiveToken,
  TokenDetails,
  Wallet,
  WalletAddressScanner,
  WalletTokenSendFrom,
  WalletTokenSendReview,
  WalletTokenSendTo,
} from 'screens/index';

import { ScreenNames } from '../theme';

const Stack = createStackNavigator();

const WalletTabStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name={ScreenNames.Wallet} component={Wallet} />
      <Stack.Screen name={ScreenNames.ReceiveToken} component={ReceiveToken} />
      <Stack.Screen name={ScreenNames.TokenDetails} component={TokenDetails} />
      <Stack.Screen
        name={ScreenNames.WalletTokenSendFrom}
        component={WalletTokenSendFrom}
        options={{
          presentation: 'modal',
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name={ScreenNames.WalletTokenSendTo}
        component={WalletTokenSendTo}
      />
      <Stack.Screen
        name={ScreenNames.WalletAddressScanner}
        component={WalletAddressScanner}
        options={{
          presentation: 'modal',
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name={ScreenNames.WalletTokenSendReview}
        component={WalletTokenSendReview}
      />
      <Stack.Screen
        name={ScreenNames.ActivityDetails}
        component={ActivityDetails}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenNames.ChooseNetwork}
        component={ChooseNetwork}
      />
      <Stack.Screen name={ScreenNames.AddToken} component={AddToken} />
      <Stack.Screen
        name={ScreenNames.GasPriceAlert}
        component={GasPriceAlert}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={ScreenNames.NetworkFilter}
        component={NetworkFilter}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={ScreenNames.AddNetwork}
        component={AddNetwork}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name={ScreenNames.AddressBook} component={AddressBook} />
      <Stack.Screen
        name={ScreenNames.AddAddress}
        component={AddAddress}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

export default WalletTabStack;
