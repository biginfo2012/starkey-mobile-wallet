import React from 'react';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { mockData } from 'theme/mockData';

import TokensListView from './TokensListView';

test('render correctly', () => {
  const component = (
    <NavigationContainer>
      <Provider store={store}>
        <TokensListView
          testID="TokensListView"
          tokenList={Object.values(mockData.networksListArray)}
          onPressFilter={jest.fn}
          onPressSort={jest.fn}
          onPressRedirect={jest.fn}
        />
      </Provider>
    </NavigationContainer>
  );
  render(component);
});
