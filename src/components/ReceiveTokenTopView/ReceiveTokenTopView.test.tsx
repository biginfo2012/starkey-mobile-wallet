import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { formatAddress } from 'theme/Helper/Address';

import ReceiveTokenTopView from './ReceiveTokenTopView';

jest.mock('theme/Variables', () => ({
  MetricsSizes: {
    small: 8,
    regular: 16,
    tiny: 4,
  },
}));

jest.mock('hooks/useTheme', () => () => ({
  Colors: {
    // Mocked colors
    primary: 'red',
    secondary: 'blue',
  },
  Images: {
    // Mocked images
  },
  Gutters: {
    // Mocked gutters
    small: 8,
    regular: 16,
  },
  Layout: {
    // Mocked layout
    container: {
      flex: 1,
    },
    row: { flexDirection: 'row' },
    rowCenter: { flexDirection: 'row', alignItems: 'center' },
    justifyContentEnd: { justifyContent: 'flex-end' },
  },
  Fonts: {
    // Mocked fonts
    textRegularBold: {
      fontWeight: 'bold',
    },
    textLarge: {
      fontSize: 16,
    },
  },
  MetricsSizes: {
    tiny: 8,
  },
}));
describe('ReceiveTokenTopView', () => {
  it('renders correctly', () => {
    const qrCodeText = 'QR Code Text';
    const walletAddress = '0x1a45Db93E901AEcFdC72De150dEC4DAD0Ed275d3';
    const onSavePress = jest.fn();
    const onCopyPress = jest.fn();
    const onSharePress = jest.fn();

    const { getByText } = render(
      <Provider store={store}>
        <ReceiveTokenTopView
          qrCodeText={qrCodeText}
          walletAddress={walletAddress}
          onSavePress={onSavePress}
          onCopyPress={onCopyPress}
          onSharePress={onSharePress}
          tokenIconPath={0}
          networkName={''}
          activeTab={0}
          setActiveTab={jest.fn()}
        />
      </Provider>,
    );

    expect(getByText(formatAddress(walletAddress, 'short'))).toBeTruthy(); // Check if the wallet address is rendered correctly
  });
});
