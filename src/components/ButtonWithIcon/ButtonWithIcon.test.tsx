import React from 'react';
import { Provider } from 'react-redux';

import { render, screen } from '@testing-library/react-native';
import { store } from 'store/index';
import Images from 'theme/Images';

import { ButtonWithIcon } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <ButtonWithIcon
        text={'123'}
        onPress={jest.fn}
        iconPath={Images.ic_background}
      />
    </Provider>
  );
  render(component);

  const container = screen.getByTestId('button');
  expect(component.props.children.props.onPress).toBe(jest.fn);
  expect(component.props.children.props.text).toBe('123');
  expect(container.props.children.length).toBe(2);
});
