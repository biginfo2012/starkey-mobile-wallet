import React from 'react';

import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {
  ActionComplete,
  BackUpFirstRecoveryPhrase,
  ChooseNetwork,
  CreateAccount,
  CreatePassword,
  DecryptFilePassword,
  ImportExistingAssets,
  ImportWallet,
  RecoveryVideo,
  SetupBioMatrices,
  Welcome,
  ChooseRecoveryMethod,
  RecoveryUsingSecretPhrase,
  FilesRecoveryLocationSelection,
  VerifyRecoveryPhrase,
  CreateAccountChooseRecoveryMethod,
  FileRecovery,
  BackUpWalletUsingIcloud,
  BackUpWalletUsingDevice,
  BackUpWalletUsingGuarantor,
  WelcomeBack,
  ChooseImportWalletMethod,
  CreateAccountRecoveryVideo,
} from 'screens/index';

import { ScreenNames } from '../theme';

const Stack = createStackNavigator();

const PreLoginNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      <Stack.Screen name={ScreenNames.Welcome} component={Welcome} />

      <Stack.Screen
        name={ScreenNames.SetupBioMatrices}
        component={SetupBioMatrices}
        options={{ gestureEnabled: false }}
      />

      <Stack.Screen
        name={ScreenNames.CreateAccount}
        component={CreateAccount}
        options={({ route }) => ({
          cardStyleInterpolator: route?.params?.animation,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name={ScreenNames.ChooseNetwork}
        component={ChooseNetwork}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenNames.RecoveryVideo}
        component={RecoveryVideo}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenNames.ActionComplete}
        component={ActionComplete}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenNames.VerifyRecoveryPhrase}
        component={VerifyRecoveryPhrase}
      />
      <Stack.Screen
        name={ScreenNames.ImportExistingAssets}
        component={ImportExistingAssets}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenNames.BackUpFirstRecoveryPhrase}
        component={BackUpFirstRecoveryPhrase}
      />
      <Stack.Screen name={ScreenNames.ImportWallet} component={ImportWallet} />
      <Stack.Screen
        name={ScreenNames.CreatePassword}
        component={CreatePassword}
      />
      <Stack.Screen
        name={ScreenNames.DecryptFilePassword}
        component={DecryptFilePassword}
      />
      <Stack.Screen name={ScreenNames.FileRecovery} component={FileRecovery} />
      <Stack.Screen
        name={ScreenNames.ChooseRecoveryMethod}
        component={ChooseRecoveryMethod}
      />
      <Stack.Screen
        name={ScreenNames.CreateAccountChooseRecoveryMethod}
        component={CreateAccountChooseRecoveryMethod}
      />
      <Stack.Screen
        name={ScreenNames.RecoveryUsingSecretPhrase}
        component={RecoveryUsingSecretPhrase}
      />
      <Stack.Screen
        name={ScreenNames.FilesRecoveryLocationSelection}
        component={FilesRecoveryLocationSelection}
      />
      <Stack.Screen
        name={ScreenNames.BackUpWalletUsingIcloud}
        component={BackUpWalletUsingIcloud}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenNames.BackUpWalletUsingDevice}
        component={BackUpWalletUsingDevice}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenNames.BackUpWalletUsingGuarantor}
        component={BackUpWalletUsingGuarantor}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenNames.WelcomeBack}
        component={WelcomeBack}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenNames.CreateAccountRecoveryVideo}
        component={CreateAccountRecoveryVideo}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenNames.ChooseImportWalletMethod}
        component={ChooseImportWalletMethod}
        options={{
          presentation: 'modal',
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default PreLoginNavigator;
