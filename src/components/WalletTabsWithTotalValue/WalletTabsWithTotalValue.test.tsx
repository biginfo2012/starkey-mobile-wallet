import React from 'react';
import { Provider } from 'react-redux';

import { store } from 'store/index';
import { USDollar } from 'theme/Helper/common/Function';

import WalletTabsWithTotalValue from './WalletTabsWithTotalValue';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <WalletTabsWithTotalValue
        selectedType={0}
        setSelectedType={jest.fn}
        tokenAmount={USDollar().format(128435.35)}
      />
    </Provider>
  );
  expect(component.props.children.props.selectedType).toBe(0);
});
