import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { injectStore } from 'theme/Helper/common/Function';

import { RecentTransactionListView } from '..';

describe('RecentTransactionListView', () => {
  beforeEach(() => {
    injectStore(store);
  });

  it('render correctly', () => {
    const component = (
      <Provider store={store}>
        <RecentTransactionListView
          title={'test'}
          recentTransactionAddressList={[
            {
              address: 'test',
              networkShortName: 'test',
              profileIcon: 'test',
              userId: 'test',
              userName: 'test',
            },
          ]}
          onPress={jest.fn}
        />
      </Provider>
    );
    render(component);
  });
});
