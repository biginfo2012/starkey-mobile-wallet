import React, { useState, useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import {
  BorderTextIconButton,
  HorizontalSeparatorView,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import Variables from 'theme/Variables';

import { style } from './style';

const BarcodeMask = ({
  width = 280,
  height = 230,
  edgeWidth = 20,
  edgeHeight = 20,
  edgeColor = '#FFF',
  edgeBorderWidth = 4,
  edgeRadius = 0,
  showAnimatedLine,
  lineAnimationDuration = 5000,
  animatedLineOrientation = 'horizontal',
  useNativeDriver = true,
  onPress,
}) => {
  const { Layout, Gutters, Colors, Images } = useTheme();

  const [edgeRadiusOffset] = useState(
    edgeRadius ? -Math.abs(edgeRadius / 3) : 0,
  );

  const [lineTravelWindowDistance, setLineTravelWindowDistance] = useState(0);

  const top = useRef(new Animated.Value(0));
  const left = useRef(new Animated.Value(0));

  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: lineAnimationDuration,
          easing: Easing.linear,
          useNativeDriver,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: lineAnimationDuration,
          easing: Easing.linear,
          useNativeDriver,
        }),
      ]),
    ).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-lineTravelWindowDistance, lineTravelWindowDistance], // Adjust this value as needed for the range of motion
  });

  const calculateLineTravelWindowDistance = ({
    layout,
    isHorizontalOrientation,
  }) => {
    return ((isHorizontalOrientation ? layout.height : layout.width) - 10) / 2;
  };

  const onFinderLayoutMeasured = ({ nativeEvent }) => {
    const { layout } = nativeEvent;
    const isHorizontal = animatedLineOrientation !== 'vertical';
    const travelDistance = calculateLineTravelWindowDistance({
      layout,
      isHorizontalOrientation: isHorizontal,
    });

    top.current.setValue(-travelDistance);
    left.current.setValue(-travelDistance);

    setLineTravelWindowDistance(travelDistance);
  };

  const renderEdge = edgePosition => {
    const defaultStyle = {
      width: edgeWidth,
      height: edgeHeight,
      borderColor: edgeColor,
    };
    const edgeBorderStyle = {
      topRight: {
        borderRightWidth: edgeBorderWidth,
        borderTopWidth: edgeBorderWidth,
        borderTopRightRadius: edgeRadius,
        top: edgeRadiusOffset,
        right: edgeRadiusOffset,
      },
      topLeft: {
        borderLeftWidth: edgeBorderWidth,
        borderTopWidth: edgeBorderWidth,
        borderTopLeftRadius: edgeRadius,
        top: edgeRadiusOffset,
        left: edgeRadiusOffset,
      },
      bottomRight: {
        borderRightWidth: edgeBorderWidth,
        borderBottomWidth: edgeBorderWidth,
        borderBottomRightRadius: edgeRadius,
        bottom: edgeRadiusOffset,
        right: edgeRadiusOffset,
      },
      bottomLeft: {
        borderLeftWidth: edgeBorderWidth,
        borderBottomWidth: edgeBorderWidth,
        borderBottomLeftRadius: edgeRadius,
        bottom: edgeRadiusOffset,
        left: edgeRadiusOffset,
      },
    };

    return (
      <View
        style={[
          defaultStyle,
          style(Gutters, Layout, Colors)[edgePosition + 'Edge'],
          edgeBorderStyle[edgePosition],
        ]}
      />
    );
  };

  return (
    <View style={[style(Gutters, Layout, Colors).container]}>
      <View
        style={[style(Gutters, Layout, Colors).finder, { width, height }]}
        onLayout={onFinderLayoutMeasured}
      >
        {renderEdge('topLeft')}
        {renderEdge('topRight')}
        {renderEdge('bottomLeft')}
        {renderEdge('bottomRight')}
        {showAnimatedLine && (
          <Animated.View
            style={[
              style(Gutters, Layout, Colors).animatedLine,
              { transform: [{ translateY }] },
            ]}
          />
        )}
      </View>
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.large} />

      <BorderTextIconButton
        leftIconImage={Images.ic_gallery}
        text={t('common:upload_from_gallery')}
        onPress={onPress}
        btnStyle={style(Gutters, Layout, Colors).addressBook}
        textStyle={style(Gutters, Layout, Colors).addressBookText}
      />
    </View>
  );
};

export default BarcodeMask;
