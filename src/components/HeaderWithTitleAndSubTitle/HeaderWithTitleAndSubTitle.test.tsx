import React from 'react';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { HeaderWithTitleAndSubTitle } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <NavigationContainer>
        <HeaderWithTitleAndSubTitle
          title={'test'}
          subTitle={'test'}
          shouldHideBack={true}
          shouldShowCancel={true}
        />
      </NavigationContainer>
    </Provider>
  );
  render(component);
});
