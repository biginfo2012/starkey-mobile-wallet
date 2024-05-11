/* eslint-disable react/require-default-props */
import React from 'react';
import { Text, Image, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { t } from 'i18next';

import { useTheme } from '../../hooks';
import { style } from './style';

type Props = {
  title?: string;
  subTitle?: string;
  onPressNext?: () => void;
  isNextDisabled?: boolean;
  customSubTitleView?: any;
  shouldHideBack?: boolean;
  shouldShowCancel?: boolean;
  hasLargeTitle?: boolean;
  rightButtonText?: string;
  onBackPress?: () => void;
};

export default function HeaderWithTitleAndSubTitle({
  title,
  subTitle,
  onPressNext,
  isNextDisabled,
  customSubTitleView,
  shouldHideBack,
  hasLargeTitle,
  rightButtonText,
  shouldShowCancel,
  onBackPress,
}: Props) {
  const { Fonts, Gutters, Images, Layout } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const inset = useSafeAreaInsets();
  return (
    <>
      <View style={style(Layout, Gutters, inset.bottom).container}>
        <TouchableOpacity
          onPress={() => {
            onBackPress ? onBackPress() : navigation.goBack();
          }}
        >
          {!shouldHideBack && (
            <Image
              style={style(Layout, Gutters, inset.bottom).icon}
              source={Images.ic_back}
            />
          )}
          {shouldShowCancel && (
            <Text
              style={[
                style(Layout, Gutters, inset.bottom).cancelText,
                { ...Fonts.textRegular },
              ]}
            >
              {t('common:cancel')}
            </Text>
          )}
        </TouchableOpacity>

        {!hasLargeTitle && (
          <View
            style={
              style(Layout, Gutters, inset.bottom, onPressNext)
                .smallTitleContainer
            }
          >
            <Text
              style={[
                Fonts.textRegularBold,
                Gutters.smallBMargin,
                Layout.fillShrink,
                Fonts.textCenter,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
        {onPressNext && (
          <TouchableOpacity
            onPress={onPressNext}
            disabled={isNextDisabled}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ opacity: isNextDisabled ? 0.5 : 1 }}
          >
            <Text style={Fonts.titleSmall}>
              {rightButtonText ? rightButtonText : t('common:Next')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {hasLargeTitle && (
        <Text style={[Fonts.textLarge, Gutters.smallBMargin]}>{title}</Text>
      )}
      {customSubTitleView ? customSubTitleView : null}
      {subTitle && <Text style={Fonts.textOpacityRegular}>{subTitle}</Text>}
    </>
  );
}
HeaderWithTitleAndSubTitle.defaultProps = {
  title: '',
  subTitle: '',
  isNextDisabled: false,
  shouldHideBack: false,
  hasLargeTitle: true,
};
