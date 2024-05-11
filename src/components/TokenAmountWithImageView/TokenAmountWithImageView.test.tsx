import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';
import { NetWorkType } from 'theme/Helper/constant';

import TokenAmountWithImageView from './TokenAmountWithImageView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <TokenAmountWithImageView
        title={'Send'}
        iconPath={Images.ic_ethereum}
        amount={'1'}
        usdAmount={'10'}
        tokenType={NetWorkType.ETH}
      />
    </Provider>
  );
  render(component);
});
