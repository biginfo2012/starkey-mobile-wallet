import React, { ReactElement } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';

import useTheme from 'hooks/useTheme';
import Variables from 'theme/Variables';

import { HorizontalSeparatorView } from '..';
import { style } from './styles';

type Props = {
  title: string;
  subTitle: string;
  middleView?: ReactElement;
  onLayout?: (event: LayoutChangeEvent) => void;
};

const BottomViewTitleAndSubTitle = (props: Props) => {
  const { Gutters, Colors, Fonts } = useTheme();

  const { title, subTitle, middleView, onLayout } = props;

  return (
    <View style={[style(Gutters, Colors).container]}>
      <View onLayout={onLayout}>
        <Text style={[Fonts.textLarge, Gutters.smallBMargin]}>{title}</Text>
      </View>
      <Text style={Fonts.textOpacityRegular}>{subTitle}</Text>
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.regular} />
      {middleView}
    </View>
  );
};

BottomViewTitleAndSubTitle.defaultProps = {
  middleView: undefined,
  onLayout: undefined,
};

export default BottomViewTitleAndSubTitle;
