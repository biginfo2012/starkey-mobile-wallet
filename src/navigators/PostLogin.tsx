/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { TabBarIcon } from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { run } from 'js-coroutines';
import BalanceChangeObservers from 'services/BalanceChangeObservers';
import USDConversionService from 'services/USDConversionService';
import { getAllTokenBalanceAndStartObservers } from 'services/apiActions';
import { AppDispatch, RootState } from 'store/index';
import { resetTotalBalance } from 'store/wallet';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import { navigationRef } from 'theme/navigationHelper';

import { ScreenNames } from '../theme';
import SettingsTabStack from './SettingsTabStack';
import WalletTabStack from './WalletTabStack';

const Tab = createBottomTabNavigator();

export const BottomTabs = () => {
  const { Images, Colors, NavigationColors, Fonts, Common, Layout } =
    useTheme();
  const appState = useRef(AppState.currentState);
  let appStartTime: number;

  const networks = useSelector(
    (state: RootState) => state.wallet.data.currentUserTokenArrayWithBalance,
  );
  const navigation = useNavigation();
  const autoLockTimer = useSelector(
    (state: RootState) => state.userInfo.data.config.autoLockTimer,
  );

  const networkEnvironment = useSelector((state: RootState) => {
    return state.wallet.data.networkEnvironment;
  });

  const shouldRefetchAllBalanceAndStartBalanceChangeObservers = useSelector(
    (state: RootState) =>
      state.wallet.data.shouldRefetchAllBalanceAndStartBalanceChangeObservers,
  );

  const dispatch = useDispatch<AppDispatch>();

  const startGetAllBalanceObservers = async () => {
    dispatch(
      getAllTokenBalanceAndStartObservers({
        data: networks,
        networkEnvironment: networkEnvironment,
      }),
    );
  };

  useEffect(() => {
    if (Object.keys(networks).length === 0) {
      dispatch(resetTotalBalance());
    }
    run(startGetAllBalanceObservers);
  }, [shouldRefetchAllBalanceAndStartBalanceChangeObservers]);

  useEffect(() => {
    return () => {
      BalanceChangeObservers().removeListeners();
      USDConversionService().removeListeners();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [autoLockTimer]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (
        new Date().getTime() - appStartTime > autoLockTimer &&
        autoLockTimer !== 0
      ) {
        appStartTime = new Date().getTime();
        navigation.navigate('Startup');
      }
    }

    if (appState.current.match(/active/) && nextAppState === 'background') {
      appStartTime = new Date().getTime();
    }

    appState.current = nextAppState;
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: applyOpacityToHexColor(
          Colors.placeholderColor,
          0.6,
        ),
        tabBarStyle: {
          backgroundColor: NavigationColors.background,
        },
        tabBarLabelStyle: {
          bottom: 2,
          ...Fonts.textExtraTinySemiBold,
        },
      }}
    >
      <Tab.Screen
        name={ScreenNames.WalletTabStack}
        component={WalletTabStack}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        options={({ route }) => ({
          tabBarLabel: t('common:Wallet'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon iconPath={Images.ic_wallet} color={color} />
          ),
          headerShown: false,
          tabBarStyle: (() => {
            const routeName = navigationRef.current.getCurrentRoute().name;
            if (
              routeName === ScreenNames.Main ||
              routeName === ScreenNames.Wallet ||
              routeName === ScreenNames.Accounts
            ) {
              return Common.tabBarStyle; // show tab
            } else {
              return Layout.displayNone; // hide tab
            }
          })(),
        })}
      />
      {/* <Tab.Screen
        name={ScreenNames.SwapTabStack}
        component={SwapTabStack}
        options={{
          tabBarLabel: t('common:Swap'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon iconPath={Images.ic_swap} color={color} />
          ),
          headerShown: false,
          tabBarStyle: (() => {
            const routeName = navigationRef.current.getCurrentRoute().name;
            if (
              routeName === ScreenNames.SwapTabStack ||
              routeName === ScreenNames.Swap ||
              routeName === ScreenNames.Accounts
            ) {
              return Common.tabBarStyle; // show tab
            } else {
              return Layout.displayNone; // hide tab
            }
          })(),
        }}
      /> */}
      <Tab.Screen
        name={ScreenNames.SettingsTabStack}
        component={SettingsTabStack}
        options={{
          tabBarLabel: t('common:Settings'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon iconPath={Images.ic_setting} color={color} />
          ),

          headerShown: false,
          tabBarStyle: (() => {
            const routeName = navigationRef.current.getCurrentRoute().name;
            if (
              routeName === ScreenNames.SettingsTabStack ||
              routeName === ScreenNames.Settings ||
              routeName === ScreenNames.Accounts
            ) {
              return Common.tabBarStyle; // show tab
            } else {
              return Layout.displayNone; // hide tab
            }
          })(),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
