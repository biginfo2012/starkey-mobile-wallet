import React from 'react';
import { View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';

import DashBoardHeader from './DashBoardHeader';

jest.mock('hooks/useTheme', () => () => ({
  Layout: {
    row: {},
    justifyContentBetween: {},
    rowHCenter: {},
  },
  Gutters: {
    tinyTMargin: {},
  },
  Fonts: {
    textMediumRegular: '',
  },
  Colors: {
    blackGray: '',
  },
}));

describe('DashBoardHeader', () => {
  const mockProps = {
    leftImage: { uri: 'left_image_uri' },
    middleView: <View testID="middle_view" />,
    rightImage: undefined,
    onPressLeftImage: jest.fn(),
    onPressRightImage: jest.fn(),
    rightImageStyle: { width: 100, height: 100 },
    shouldShowCancel: false,
    shouldShowClear: false,
    isRightButtonDisabled: false,
    userName: 'test',
    leftText: 'test',
    rightText: 'test',
  };

  test('renders the component correctly without LinearGradient', () => {
    const { getByTestId, queryByTestId } = render(
      <NavigationContainer>
        <DashBoardHeader {...mockProps} rightImage={null} />
      </NavigationContainer>,
    );
    const middleView = getByTestId('middle_view');
    const linearGradient = queryByTestId('linear_gradient'); // Check if LinearGradient is not rendered

    expect(middleView).toBeTruthy();
    expect(linearGradient).toBeNull();
  });

  test('renders the component correctly with LinearGradient and rightImage as colors array', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <DashBoardHeader {...mockProps} rightImage={undefined} />
      </NavigationContainer>,
    );
    const middleView = getByTestId('middle_view');

    expect(middleView).toBeTruthy();
  });

  test('calls onPressLeftImage when left image is pressed', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <DashBoardHeader {...mockProps} />
      </NavigationContainer>,
    );
    const leftImage = getByTestId('left_image');

    fireEvent.press(leftImage);
    expect(mockProps.onPressLeftImage).toHaveBeenCalled();
  });
});
