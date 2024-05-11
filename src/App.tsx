import React from 'react';
import { LogBox, Platform } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableFreeze } from 'react-native-screens';
import { Provider } from 'react-redux';

import * as Sentry from '@sentry/react-native';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { injectStore } from 'theme/Helper/common/Function';

import ApplicationNavigator from './navigators/Application';
import { store, persistor } from './store';
import './translations';

enableFreeze(true);
if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setEnableDebugging(false);
  KeyboardManager.setKeyboardDistanceFromTextField(10);
  KeyboardManager.setLayoutIfNeededOnUpdate(true);
  KeyboardManager.setEnableAutoToolbar(true);
  KeyboardManager.setToolbarDoneBarButtonItemText('Done');
  KeyboardManager.setToolbarPreviousNextButtonEnable(false);
  KeyboardManager.setShouldShowToolbarPlaceholder(true);
  KeyboardManager.setOverrideKeyboardAppearance(false);
  KeyboardManager.setKeyboardAppearance('default'); // "default" | "light" | "dark"
  KeyboardManager.setShouldResignOnTouchOutside(true);
  KeyboardManager.setShouldPlayInputClicks(true);
  KeyboardManager.resignFirstResponder();
}

if (__DEV__) {
  console.disableYellowBox = true;
}

Sentry.init({
  dsn: 'https://564efef9af5df811295c84b6eba937a2@o4506495519752192.ingest.sentry.io/4506495521193984',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  _experiments: {
    // The sampling rate for profiling is relative to TracesSampleRate.
    // In this case, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
});

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(['Require cycle']);

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        {/**
         * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
         * and saved to redux.
         * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
         * for example `loading={<SplashScreen />}`.
         * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
         */}

        <PersistGate loading={null} persistor={persistor}>
          <ApplicationNavigator />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

injectStore(store);

export default Sentry.wrap(App);
