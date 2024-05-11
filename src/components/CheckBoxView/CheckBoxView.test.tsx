import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import CheckBoxView from './CheckBoxView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <CheckBoxView isChecked={true} setIsChecked={jest.fn} text={'test'} />
    </Provider>
  );
  render(component);

  expect(component.props.children.props.isChecked).toBe(true);
});
