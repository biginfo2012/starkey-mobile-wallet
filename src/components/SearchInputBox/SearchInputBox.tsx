import React, { forwardRef } from 'react';
import {
  Image,
  ImageSourcePropType,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';

import { useTheme } from '../../hooks';
import { style } from './styles';

interface Props extends TextInputProps {
  backGroundColor?: string;
  rightIcon?: ImageSourcePropType;
  onPressSort?: () => void;
  imgIconStyle?: ViewStyle;
}

const SearchInputBox = forwardRef<TextInput, Props>((props, ref) => {
  const { backGroundColor, rightIcon, onPressSort, imgIconStyle } = props;
  const { Layout, Colors, Gutters, Common, Images, Fonts } = useTheme();

  return (
    <View
      style={[
        style(Gutters, Layout, Colors).container,
        {
          backgroundColor: backGroundColor
            ? backGroundColor
            : applyOpacityToHexColor(Colors.bottomButtonBG, 0.3),
        },
      ]}
    >
      <Image
        style={style(Gutters, Layout, Colors).icon}
        resizeMode="contain"
        source={Images.ic_search}
      />
      <TextInput
        ref={ref}
        {...props}
        style={[Common.textInput, Fonts.textRegular]}
        placeholderTextColor={applyOpacityToHexColor(
          Colors.buttonBorderColor,
          0.6,
        )}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onPressSort}>
          <Image
            style={
              imgIconStyle ?? style(Gutters, Layout, Colors).rightIconStyle
            }
            source={rightIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

SearchInputBox.defaultProps = {
  backGroundColor: '',
  rightIcon: undefined,
  onPressSort: undefined,
  imgIconStyle: undefined,
};

export default SearchInputBox;
