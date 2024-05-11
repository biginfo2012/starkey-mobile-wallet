import React, { Dispatch, SetStateAction } from 'react';
import { width } from 'react-native-size-scaling';
import { scale } from 'react-native-size-scaling';

import MultiSlider from '@ptomasroos/react-native-multi-slider';
import useTheme from 'hooks/useTheme';

import { style } from './styles';

type Props = {
  setSliderValue: Dispatch<SetStateAction<number>>;
  minValue: number;
  values: any[];
};

const GradientSlider = ({ setSliderValue, minValue, values }: Props) => {
  const { Layout, Colors } = useTheme();

  return (
    <MultiSlider
      containerStyle={style(Layout, Colors).containerStyle}
      sliderLength={width - scale(70)}
      trackStyle={style(Layout, Colors).trackStyle}
      step={values.length}
      onValuesChange={brightness => {
        setSliderValue(brightness[0] > minValue ? brightness[0] : minValue);
      }}
      optionsArray={values}
      colorGradient={Colors.primaryReversGradientColor}
      markerStyle={style(Layout, Colors).markerStyle}
      allowOverlap
      snapped
    />
  );
};

export default GradientSlider;
