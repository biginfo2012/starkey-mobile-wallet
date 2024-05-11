import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';
import { Colors } from 'theme/Variables';

import TabBarIcon from './TabBarIcon';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <TabBarIcon iconPath={Images.ic_error_tick} color={Colors.textError} />
    </Provider>
  );
  render(component);
  expect(component.props.children.props.color).not.toEqual(undefined);
  expect(component.props.children.props.color).toEqual(Colors.textError);
});
