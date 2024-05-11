import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import NotificationRawItem from './NotificationRawItem';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <NotificationRawItem
        item={{
          id: '2',
          title: '@paul2 has removed you from the guarantors of Bubbble',
          timeAgo: '2d ago',
          isExpired: false,
          status: 'read',
        }}
        onPress={jest.fn}
      />
    </Provider>
  );
  render(component);
});
