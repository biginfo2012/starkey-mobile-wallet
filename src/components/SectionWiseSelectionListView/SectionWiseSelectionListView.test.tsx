import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import mockData from 'theme/mockData';

import { SectionWiseSelectionListView } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <SectionWiseSelectionListView
        onDonePress={jest.fn}
        items={[{ title: 'test', data: mockData.nativeNetworkList }]}
        multiSelect={false}
        titleText={'test'}
        doneBtnText={'done'}
        onFilterUpdate={jest.fn}
        selectedItemsId={[]}
        onClearPress={jest.fn}
      />
    </Provider>
  );
  render(component);
});
