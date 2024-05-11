import React from 'react';
import { View } from 'react-native';

import { render } from '@testing-library/react-native';

import AnimatedRotate from './AnimatedRotate';

describe('AnimatedRotate', () => {
  it('renders correctly', () => {
    const middleView = <View testID="middle-view">Middle View</View>;
    const { getByTestId } = render(<AnimatedRotate middleView={middleView} />);

    const animatedView = getByTestId('animated-view');
    const middleViewElement = getByTestId('middle-view');

    // Assert that AnimatedRotate renders
    expect(animatedView).toBeTruthy();

    // Assert that middleView is present within AnimatedRotate
    expect(middleViewElement).toBeTruthy();
    expect(middleViewElement).toHaveTextContent('Middle View');
  });
});
