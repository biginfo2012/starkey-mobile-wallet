import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import Images from 'theme/Images';

import TokenAction from './TokenAction';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <TokenAction text={'test'} iconPath={Images.ic_swap} onPress={jest.fn} />
    </Provider>
  );
  render(component);

  expect(component.props.children.props.onPress).toBe(jest.fn);
  expect(component.props.children.props.text).toBe('test');
});
