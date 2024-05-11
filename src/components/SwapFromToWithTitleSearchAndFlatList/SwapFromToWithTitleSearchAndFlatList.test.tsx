import React from 'react';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import mockData from 'theme/mockData';

import { SwapFromToWithTitleSearchAndFlatList } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <NavigationContainer>
        <SwapFromToWithTitleSearchAndFlatList
          handleBackPress={jest.fn}
          title={'test'}
          flatListData={mockData.SwapFromToTokenListData}
          selectedId={'1'}
          handleOnPress={jest.fn}
        />
      </NavigationContainer>
    </Provider>
  );
  render(component);
});
