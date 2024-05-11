/* eslint-disable react/require-default-props */
import React, { ReactElement, memo } from 'react';
import {
  View,
  Image,
  ImageURISource,
  TouchableOpacity,
  ImageStyle,
  ViewStyle,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale } from 'react-native-size-scaling';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import ScreenNames from 'theme/screenNames';

import { style } from './styles';

type Props = {
  leftImage?: ImageURISource;
  middleView?: ReactElement;
  rightImage?: string;
  rightSideSecondImage?: ImageURISource;
  rightImageStyle?: ImageStyle;
  onPressLeftImage: () => void;
  onPressRightImage?: () => void;
  onPressRightSideSecondImage?: () => void;
  containerStyle?: ViewStyle;
  shouldShowCancel?: boolean;
  shouldShowClear?: boolean;
  testID?: string;
  leftText?: string;
  rightText?: string;
  isRightButtonDisabled?: boolean;
  userName?: string;
};

const DashBoardHeader = (props: Props) => {
  const { Layout, Gutters, Fonts, Colors } = useTheme();

  const {
    leftImage,
    middleView,
    rightImage,
    rightSideSecondImage,
    onPressLeftImage,
    onPressRightImage,
    onPressRightSideSecondImage,
    rightImageStyle,
    containerStyle,
    shouldShowCancel,
    shouldShowClear,
    testID,
    leftText,
    rightText,
    isRightButtonDisabled,
    userName,
  } = props;

  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <View
      testID={testID}
      style={[style(Layout, Gutters).container, containerStyle]}
    >
      <TouchableOpacity onPress={onPressLeftImage}>
        {!shouldShowCancel ? (
          <Image
            testID="left_image"
            style={{
              height: scale(24),
              width: scale(24),
            }}
            source={leftImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={Fonts.textMediumRegular}>{leftText}</Text>
        )}
      </TouchableOpacity>
      {middleView}
      <View style={[Layout.row, Layout.alignItemsCenter]}>
        {rightSideSecondImage && (
          <TouchableOpacity onPress={onPressRightSideSecondImage}>
            <Image
              testID="right_image"
              style={[
                {
                  height: scale(22),
                  width: scale(22),
                },
                style(Layout, Gutters).rightLeftIcon,
              ]}
              resizeMode="contain"
              source={rightSideSecondImage}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            if (onPressRightImage) {
              onPressRightImage();
            } else {
              navigation.navigate(ScreenNames.Accounts);
            }
          }}
          disabled={isRightButtonDisabled}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ opacity: isRightButtonDisabled ? 0.5 : 1 }}
        >
          {!shouldShowClear ? (
            rightImage ? (
              typeof rightImage === 'object' ? (
                <LinearGradient
                  testID="linear_gradient"
                  colors={rightImage}
                  useAngle={true}
                  angle={200}
                  style={style(Layout, Gutters).profileImage}
                />
              ) : (
                <Image
                  testID="right_image"
                  style={[
                    style(Layout, Gutters).profileImage,
                    { ...rightImageStyle },
                  ]}
                  source={rightImage}
                  resizeMode={'contain'}
                />
              )
            ) : userName ? (
              <View style={style(Layout, Gutters, Colors).textImage}>
                <Text style={[Fonts.titleSmall, { color: Colors.blackGray }]}>
                  {`${userName?.split(' ')[0][0]}`}
                </Text>
              </View>
            ) : (
              <></>
            )
          ) : (
            <Text style={Fonts.textMediumRegular}>{rightText}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

DashBoardHeader.defaultProps = {
  leftImage: undefined,
  rightSideSecondImage: undefined,
  rightImageStyle: {},
  middleView: undefined,
  shouldShowCancel: false,
  shouldShowClear: false,
  onPressRightImage: undefined,
  onPressRightSideSecondImage: () => {},
  leftText: t('common:cancel'),
  rightText: t('common:Clear'),
  isRightButtonDisabled: false,
  userName: '',
  rightImage: '',
};

export default memo(DashBoardHeader);
