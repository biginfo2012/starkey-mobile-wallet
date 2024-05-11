import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';
import { USDollar } from 'theme/Helper/common/Function';
import { NetWorkType } from 'theme/Helper/constant';

import NetworkItem from './NetworkItem';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <NetworkItem
        item={{
          id: '1',
          image: Images.ic_solana,
          title: NetWorkType.SOL,
          subTitle: 'Solana',
          amount: '1000',
          usdAmount: USDollar().format(1000),
        }}
      />
    </Provider>
  );
  render(component);
});
