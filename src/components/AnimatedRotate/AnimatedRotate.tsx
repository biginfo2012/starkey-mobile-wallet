import React, { ReactElement, useEffect } from 'react';
import { Animated } from 'react-native';

type Props = {
  middleView: ReactElement;
};

const AnimatedRotate = ({ middleView }: Props) => {
  const rotateValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      testID="animated-view"
      style={{
        transform: [{ rotate }],
      }}
    >
      {middleView}
    </Animated.View>
  );
};

export default AnimatedRotate;
