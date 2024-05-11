import React, { useEffect, useState } from 'react';
import { BackHandler, Platform, View } from 'react-native';

import { useIsFocused, useRoute } from '@react-navigation/native';
import {
  BackgroundView,
  BottomViewTitleAndSubTitle,
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

const CreateAccountRecoveryVideo: React.FC<any> = () => {
  const { title, subTitle, videoUrl, btnText, redirectToNextScreen } =
    useRoute().params as any;

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

  const { Common, Images, Layout } = useTheme();
  return (
    <SafeAreaWrapper applyToOnlyTopEdge={true}>
      <BackgroundView
        image={Images.background.ic_files_recovery_bg}
        isFullScreen={false}
      />
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle hasLargeTitle={false} />
        <View style={[Layout.fill, Layout.center]}>
          {isScreenFocused && (
            <VideoPlayer
              videoUrl={videoUrl}
              isVideoPaused={!isForeground || !isScreenFocused}
              shouldShowVideoBtn={shouldShowVideoBtn}
              setShouldShowVideoBtn={setShouldShowVideoBtn}
            />
          )}
        </View>
      </View>
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
      <BottomViewTitleAndSubTitle
        title={title}
        subTitle={subTitle}
        middleView={
          <>
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
            <Button
              text={btnText}
              onPress={() => {
                setShouldShowVideoBtn(false);
                redirectToNextScreen();
              }}
            />
          </>
        }
      />
    </SafeAreaWrapper>
  );
};

export default CreateAccountRecoveryVideo;
