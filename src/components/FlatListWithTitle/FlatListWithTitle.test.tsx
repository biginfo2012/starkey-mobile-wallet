import React from 'react';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import mockData from 'theme/mockData';

import { FlatListWithTitle } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <NavigationContainer>
        <FlatListWithTitle
          title={'test'}
          flatListData={mockData.CurrencyListData}
          selectedItem={'test'}
        />
      </NavigationContainer>
    </Provider>
  );
  render(component);
});
