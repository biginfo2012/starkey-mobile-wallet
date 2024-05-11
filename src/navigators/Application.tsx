import React from 'react';
import { StatusBar, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { useFlipper } from '@react-navigation/devtools';
import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import NotificationScreen from 'components/NotificationScreen/NotificationScreen';
import { Loader, NoInternetView, ReceivedTokenPopUp } from 'components/index';
import {
  Accounts,
  BackUpFirstRecoveryPhrase,
  ChooseImage,
  ChooseImportWalletMethod,
  CreateEditImportAccount,
  ImportWallet,
  SecretRecoveryPhrase,
} from 'screens/index';
import { navigationRef } from 'theme/navigationHelper';

import { ApplicationStackParamList } from '../../@types/navigation';
import { useTheme } from '../hooks';
import { Startup } from '../screens';
import MainNavigator from './Main';

const Stack = createStackNavigator<ApplicationStackParamList>();

const ApplicationNavigator = () => {
  const { Layout, NavigationTheme, Colors } = useTheme();

  useFlipper(navigationRef);

  return (
    <View style={Layout.fill}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={Colors.background}
        />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Startup" component={Startup} />
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="Accounts" component={Accounts} />
          <Stack.Screen
            name="CreateEditImportAccount"
            component={CreateEditImportAccount}
          />
          <Stack.Screen
            name={'ChooseImportWalletMethod'}
            component={ChooseImportWalletMethod}
            options={{
              presentation: 'modal',
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            }}
          />
          <Stack.Screen name={'ImportWallet'} component={ImportWallet} />
          <Stack.Screen
            name={'ChooseImage'}
            component={ChooseImage}
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name={'SecretRecoveryPhrase'}
            component={SecretRecoveryPhrase}
          />
          <Stack.Screen
            name={'BackUpFirstRecoveryPhrase'}
            component={BackUpFirstRecoveryPhrase}
          />
        </Stack.Navigator>
        <Loader />
        <ReceivedTokenPopUp />
        <Toast />
        <NoInternetView />
        <NotificationScreen />
      </NavigationContainer>
    </View>
  );
};

export default ApplicationNavigator;
