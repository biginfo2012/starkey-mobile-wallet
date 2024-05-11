import React from 'react';
import { Provider } from 'react-redux';

import { render, screen } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';
import { Colors } from 'theme/Variables';

import ErrorView from './ErrorView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <ErrorView
        text={'test'}
        iconPath={Images.ic_error_tick}
        textColor={Colors.textError}
      />
    </Provider>
  );
  render(component);

  const container = screen.getByTestId('errorMessage');
  expect(container.props.children).not.toEqual(undefined);
  expect(component.props.children.props.textColor).not.toEqual(undefined);
});
