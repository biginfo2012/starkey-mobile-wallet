import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import mockData from 'theme/mockData';

import { SortByFilterBottomSheetView } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <SortByFilterBottomSheetView
        multiSelect={false}
        title={'test'}
        onDonePress={jest.fn}
        onClearPress={jest.fn}
        isSheetOpen={true}
        onChange={jest.fn}
        items={mockData.walletNetworkSorting}
        onClose={jest.fn}
      />
    </Provider>
  );
  render(component);
});
