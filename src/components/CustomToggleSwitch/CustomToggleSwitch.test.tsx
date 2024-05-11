import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import CustomToggleSwitch from './CustomToggleSwitch';

test('render correctly', () => {
  const componentCase1 = (
    <Provider store={store}>
      <CustomToggleSwitch isEnabled={true} onPress={jest.fn} />
    </Provider>
  );
  render(componentCase1);

  expect(componentCase1.props.children.props.isEnabled).toBe(true);

  const componentCase2 = (
    <Provider store={store}>
      <CustomToggleSwitch isEnabled={false} onPress={jest.fn} />
    </Provider>
  );
  render(componentCase2);
  expect(componentCase2.props.children.props.isEnabled).toBe(false);
});
