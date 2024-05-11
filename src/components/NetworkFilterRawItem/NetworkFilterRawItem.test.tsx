import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { injectStore } from 'theme/Helper/common/Function';
import { defaultNetwork } from 'theme/Helper/constant';
import mockData from 'theme/mockData';

import { NetworkFilterRawItem } from '..';

describe('NetworkFilterRawItem', () => {
  beforeEach(() => {
    injectStore(store);
  });

  it('render correctly', () => {
    const component = (
      <Provider store={store}>
        <NetworkFilterRawItem
          onPress={jest.fn}
          item={mockData.networksListArray[defaultNetwork]}
          selectedItem={mockData.networksListArray[defaultNetwork]}
          onCreatePress={jest.fn}
        />
      </Provider>
    );
    render(component);
  });
});
