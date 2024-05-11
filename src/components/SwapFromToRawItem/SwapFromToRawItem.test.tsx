import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import Images from 'theme/Images';

import { SwapFromToRawItem } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <SwapFromToRawItem
        item={{
          id: '1',
          image: Images.ic_supra,
          title: 'SUPRA',
          networkName: '',
          subTitle: 'Supra',
          amount: 639,
          usdAmount: 56,
          tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
          providerNetworkRPC_URL:
            'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
          providerNetworkRPC_Network_Name: 'goerli',
          explorerURL: 'https://goerli.etherscan.io',
          decimal: 1,
        }}
        selectedId={'1'}
        onPress={jest.fn}
      />
    </Provider>
  );
  render(component);
});
