import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { t } from 'i18next';
import { store } from 'store/index';
import { NetWorkType } from 'theme/Helper/constant';

import AmountView from './AmountView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <AmountView
        title={t('common:network_fee')}
        amount={'0.00437'}
        usdAmount={'14'}
        tokenType={NetWorkType.ETH}
      />
    </Provider>
  );
  render(component);
});
