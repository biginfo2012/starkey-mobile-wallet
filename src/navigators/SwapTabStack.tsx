import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import {
  SelectNetwork,
  Swap,
  SwapActivity,
  SwapFrom,
  SwapReview,
  SwapTo,
} from 'screens/index';

import { ScreenNames } from '../theme';

const Stack = createStackNavigator();

const SwapTabStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name={ScreenNames.Swap} component={Swap} />
      <Stack.Screen
        name={ScreenNames.SelectNetwork}
        component={SelectNetwork}
      />
      <Stack.Screen name={ScreenNames.SwapFrom} component={SwapFrom} />
      <Stack.Screen name={ScreenNames.SwapTo} component={SwapTo} />
      <Stack.Screen name={ScreenNames.SwapReview} component={SwapReview} />
      <Stack.Screen name={ScreenNames.SwapActivity} component={SwapActivity} />
    </Stack.Navigator>
  );
};

export default SwapTabStack;
