import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

import useTheme from 'hooks/useTheme';

import { FadeAnimationRef } from './FadeAnimation.types';

interface FadeAnimationProps {
  children: React.ReactNode;
}

const FadeAnimation = forwardRef<FadeAnimationRef, FadeAnimationProps>(
  ({ children }, ref) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const { Layout } = useTheme();

    const startAnimation = (toValue: number, onComplete?: () => void) => {
      Animated.timing(fadeAnim, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }).start(value => {
        if (value.finished && onComplete) {
          onComplete();
        }
      });
    };

    const fadeIn = () => {
      startAnimation(1, () => {});
    };

    const fadeOut = () => {
      startAnimation(0, () => {});
    };

    // Expose the fadeIn and fadeOut functions through the ref
    useImperativeHandle(ref, () => ({
      fadeIn,
      fadeOut,
    }));

    return (
      <Animated.View
        style={{ opacity: fadeAnim, ...Layout.absoluteFill } as ViewStyle}
      >
        {/* Render the children directly */}
        {children}
      </Animated.View>
    );
  },
);

export default FadeAnimation;
