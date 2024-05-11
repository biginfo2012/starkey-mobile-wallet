import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import mockData from 'theme/mockData';

import { RecoverySelectionListView } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <RecoverySelectionListView
        onItemPress={jest.fn}
        data={mockData.createAccount_recoveryOptions}
      />
    </Provider>
  );
  render(component);
});
