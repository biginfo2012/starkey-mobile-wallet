import React from 'react';

import { render } from '@testing-library/react-native';

import FilterSortingHeader from './FilterSortingHeader';

jest.mock('hooks/useTheme', () => {
  return () => ({
    Fonts: {
      textSmallBold: 'mockTextSmallBold',
    },
    Colors: {
      black: 'mockBlack',
      white: 'mockWhite',
    },
    Layout: {
      row: 'mockRow',
    },
    Gutters: {
      regularBMargin: 'mockRegularBMargin',
    },
  });
});

describe('FilterSortingHeader', () => {
  test('renders correctly with enabled done button', () => {
    const isDoneButtonEnabled = true;
    const titleText = 'Title';
    const doneBtnText = 'Apply';
    const onClearPress = jest.fn();
    const onDonePress = jest.fn();

    const { getByText } = render(
      <FilterSortingHeader
        isDoneButtonEnabled={isDoneButtonEnabled}
        titleText={titleText}
        doneBtnText={doneBtnText}
        onClearPress={onClearPress}
        onDonePress={onDonePress}
      />,
    );

    const doneButton = getByText(titleText);
    expect(doneButton).toBeTruthy();
  });
});
