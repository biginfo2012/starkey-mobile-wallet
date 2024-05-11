import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import GradientSlider from './GradientSlider';

describe('GradientSlider', () => {
  it('renders correctly', () => {
    const mockProps = {
      sliderValue: 20,
      setSliderValue: jest.fn(),
      minValue: 10,
    };

    const { getByTestId } = render(
      <Provider store={store}>
        <GradientSlider values={[]} {...mockProps} />
      </Provider>,
    );

    expect(getByTestId).toBeTruthy();
  });
});
