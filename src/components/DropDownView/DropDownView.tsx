import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  TextInputProps,
} from 'react-native';

import { t } from 'i18next';

import { ErrorView } from '..';
import { useTheme } from '../../hooks';
import { style } from './styles';

interface Props extends TextInputProps {
  borderColor?: string;
  isShowError?: boolean | string;
  errMessage?: string;
  rightIconPath?: ImageSourcePropType;
  onPress: () => void;
  backGroundColor?: string;
  text: string;
}

const DropDownView = (props: Props) => {
  const {
    borderColor,
    isShowError = false,
    errMessage,
    rightIconPath,
    onPress,
    backGroundColor,
    text,
  } = props;
  const { Layout, Colors, Gutters, Common, Images, Fonts } = useTheme();

  return (
    <>
      <Pressable
        onPress={onPress}
        style={[
          style(Gutters, Layout, Colors).container,
          {
            borderColor: borderColor ? borderColor : Colors.inputBackground,
            backgroundColor: backGroundColor
              ? backGroundColor
              : Colors.inputBackground,
          },
        ]}
      >
        <Text style={[Common.textInput, Fonts.textRegular]}>{text}</Text>
        <Image
          resizeMode={'contain'}
          source={rightIconPath ? rightIconPath : Images.ic_drop_down}
          style={style(Gutters, Layout, Colors).icon}
        />
      </Pressable>
      {isShowError ? (
        <ErrorView
          text={t(errMessage)}
          iconPath={Images.ic_error_tick}
          textColor={Colors.textError}
        />
      ) : null}
    </>
  );
};

DropDownView.defaultProps = {
  borderColor: '',
  isShowError: false,
  errMessage: '',
  rightIconPath: undefined,
  backGroundColor: '',
};

export default DropDownView;
