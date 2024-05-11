import React, { useEffect, useState } from 'react';
import { BackHandler, Platform, View } from 'react-native';

import { useIsFocused, useRoute } from '@react-navigation/native';
import {
  BackgroundView,
  Button,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  SafeAreaWrapper,
  VideoPlayer,
} from 'components/index';
import { useIsForeground } from 'customHooks/useIsForeground';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import Variables from 'theme/Variables';

const RecoveryVideo: React.FC<any> = () => {
  const { Common, Images } = useTheme();
  const {
    title,
    subTitle,
    videoUrl,
    btnText,
    shouldHideBackBtn,
    redirectToNextScreen,
  } = useRoute().params as any;

  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const [shouldShowVideoBtn, setShouldShowVideoBtn] = useState(true);

  useEffect(() => {
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      Platform.OS === 'android' &&
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const backAction = () => {
    return true;
  };

  useUpdateEffect(() => {
    if (!isScreenFocused) {
      setShouldShowVideoBtn(true);
    }
  }, [isScreenFocused]);

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <View style={Common.containerFillWithSmallHPadding}>
        {!shouldHideBackBtn ? (
          <HeaderWithTitleAndSubTitle />
        ) : (
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        )}
        {isScreenFocused && (
          <VideoPlayer
            videoUrl={videoUrl}
            isVideoPaused={!isForeground || !isScreenFocused}
            shouldShowVideoBtn={shouldShowVideoBtn}
            setShouldShowVideoBtn={setShouldShowVideoBtn}
          />
        )}
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <HeaderWithTitleAndSubTitle
          title={title}
          subTitle={subTitle}
          shouldHideBack
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <Button
          text={btnText}
          onPress={() => {
            setShouldShowVideoBtn(false);
            redirectToNextScreen();
          }}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default RecoveryVideo;
