/* eslint-disable react/require-default-props */
import React from 'react';
import { View, Text, Image, TextStyle, ImageStyle } from 'react-native';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';

import GradientText from '../GradientText/GradientText';
import VerticalSeparatorView from '../VerticalSeparatorView/VerticalSeparatorView';
import { style } from './styles';

type Props = {
  textStyle?: TextStyle;
  iconStyle?: ImageStyle;
  text?: string;
  shouldShowWarningLeftIcon?: boolean;
  warningArray?: string[];
};

export default function WarningView(props: Props) {
  const {
    textStyle,
    iconStyle,
    text,
    shouldShowWarningLeftIcon,
    warningArray,
  } = props;
  const { Gutters, Layout, Images, Fonts, Colors } = useTheme();

  return (
    <View style={style(Gutters, Layout, Colors).container}>
      {shouldShowWarningLeftIcon ? (
        <>
          <Image
            style={[style(Gutters, Layout, Colors).errorImage, iconStyle]}
            source={Images.ic_error}
          />
          <VerticalSeparatorView />
        </>
      ) : (
        <></>
      )}
      <View style={style(Gutters, Layout, Colors).textsWrapper}>
        {text ? (
          <Text style={textStyle ? textStyle : Fonts.textTinyDescriptionBold}>
            {text}
          </Text>
        ) : (
          <View style={style(Gutters, Layout, Colors).warningTextContainer}>
            <GradientText
              text={t('common:WARNING')}
              colors={Colors.primaryGradientColor}
              containerStyle={
                style(Gutters, Layout, Colors).warningGradientTextContainer
              }
              fontStyle={Fonts.textSmallBold}
            />

            {warningArray?.map((item, index) => (
              <View key={index} style={style(Gutters, Layout, Colors).textItem}>
                <Text style={Fonts.textTinyDescriptionBold}>
                  {warningArray?.length > 1 ? `${index + 1}. ` : ''}
                </Text>
                <Text
                  style={textStyle ? textStyle : Fonts.textTinyDescriptionBold}
                >
                  {t(item as any)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
