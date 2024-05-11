import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { MaximumPasswordCharacters } from 'theme/Helper/constant';

import { useTheme } from '../../hooks';
import { style } from './style';

type Props = {
  title: string;
  subTitle?: string;
  rightIconPath?: ImageSourcePropType;
  containerStyle?: ViewStyle;
  textWrapperStyle?: ViewStyle;
  titleStyle?: TextStyle | [TextStyle];
  subTitleStyle?: TextStyle | [TextStyle];
  isTitleEditable?: boolean;
  onTextChange: (text: string) => void;
};

export default function TitleDescriptionView({
  title,
  subTitle,
  rightIconPath,
  containerStyle,
  textWrapperStyle,
  titleStyle,
  subTitleStyle,
  isTitleEditable,
  onTextChange,
}: Props) {
  const { Fonts, Gutters, Colors, Layout } = useTheme();

  const onChangeText = (inputText: string) => {
    const text = inputText.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    onTextChange(text);
  };

  return (
    <>
      <View style={[style(Layout, Gutters, Colors).container, containerStyle]}>
        <View
          style={[style(Layout, Gutters, Colors).textView, textWrapperStyle]}
        >
          {isTitleEditable ? (
            <>
              <View style={style(Layout, Gutters, Colors).textInputContainer}>
                <TextInput
                  value={title?.split('.')[0]}
                  onChangeText={onChangeText}
                  maxLength={MaximumPasswordCharacters}
                  style={[
                    Fonts.textSmallWhiteBold,
                    style(Layout, Gutters, Colors).textInput,
                  ]}
                />

                <Text style={[Fonts.textOpacitySmall]}>
                  {'.' + title?.split('.')[1]}
                </Text>
              </View>
            </>
          ) : (
            <Text style={[Fonts.textSmallWhiteBold, titleStyle]}>{title}</Text>
          )}

          {subTitle && (
            <Text
              style={[Fonts.textSmallTinyGrayOpacityRegular, subTitleStyle]}
            >
              {subTitle}
            </Text>
          )}
        </View>
        {rightIconPath && (
          <Image
            style={[style(Layout, Gutters, Colors).icon]}
            resizeMode="contain"
            source={rightIconPath}
          />
        )}
      </View>
    </>
  );
}
TitleDescriptionView.defaultProps = {
  subTitle: '',
  rightIconPath: undefined,
  isTitleEditable: false,
  containerStyle: null,
  textWrapperStyle: null,
  titleStyle: null,
  subTitleStyle: null,
};
