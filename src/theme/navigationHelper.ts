import * as React from 'react';

import { CommonActions } from '@react-navigation/core';
import { StackActions } from '@react-navigation/routers';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function navigatePush(name, params) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}

export function navigateBack() {
  navigationRef.current?.goBack();
}

export function navigateReset(name, params) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      routes: [
        {
          name: name,
          params: params,
        },
      ],
    }),
  );
}
