import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import mockData from 'theme/mockData';

import { SelectionListView } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <SelectionListView
        selectedItemsId={[]}
        onDonePress={jest.fn}
        items={mockData.nativeNetworkList}
        multiSelect={false}
        titleText={'test'}
        doneBtnText={'done'}
        onFilterUpdate={jest.fn}
        onClearPress={jest.fn}
        shouldHideHeader={false}
      />
    </Provider>
  );
  render(component);
});
