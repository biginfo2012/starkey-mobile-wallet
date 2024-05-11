import React from 'react';
import { Provider } from 'react-redux';

import { render, screen } from '@testing-library/react-native';
import { store } from 'store/index';
import AnimationType from 'theme/Enums';

import LottieAnimations from './LottieAnimations';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <LottieAnimations type={AnimationType.Celebration} />
    </Provider>
  );
  render(component);

  const container = screen.getByTestId('lottie-animation-view');
  expect(component.props.children.props.type).toBe(AnimationType.Celebration);
  expect(container.props.speed).toBe(1);
  expect(container.props.loop).toBe(true);
  render(component);
});
