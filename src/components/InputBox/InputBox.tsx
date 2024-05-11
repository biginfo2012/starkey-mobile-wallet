import React, { forwardRef, useState } from 'react';
import {
  ImageSourcePropType,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { t } from 'i18next';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';

import { CloseButton, DivideByText, ErrorView } from '..';
import { useTheme } from '../../hooks';
import { style } from './styles';

interface Props extends TextInputProps {
  borderColor?: string;
  totalTextCount?: number;
  minimumTextCount?: number;
  maximumTextCount?: number;
  isShowError?: boolean | string;
  errMessage?: string;
  shouldShowTextCount?: boolean;
  isShowMessage?: boolean | string;
  message?: string;
  messageColor?: string;
  messageIcon?: any;
  rightIconPath?: ImageSourcePropType;
  isSecureText?: boolean;
  onPressRightIcon?: () => void;
  backGroundColor?: string;
  onChangeValue?: (prop: any) => void;
  onChangeTextValue?: (text: string) => void;
}

const InputBox = forwardRef<TextInput, Props>((props, ref) => {
  const {
    totalTextCount,
    minimumTextCount,
    maximumTextCount = 0,
    borderColor,
    isShowError = false,
    errMessage,
    shouldShowTextCount = false,
    isShowMessage = false,
    message,
    messageColor,
    messageIcon,
    rightIconPath,
    isSecureText,
    onPressRightIcon,
    backGroundColor,
    onChangeValue,
    onChangeTextValue,
  } = props;
  const { Layout, Colors, Gutters, Common, Images, Fonts } = useTheme();

  const [isSecure, setSecure] = useState<boolean>(
    isSecureText !== undefined ? isSecureText : false,
  );

  return (
    <>
      <View
        style={[
          style(Gutters, Layout, Colors).container,
          {
            borderColor: borderColor
              ? borderColor
              : isShowError || totalTextCount > maximumTextCount
              ? Colors.textError
              : Colors.inputBackground,
            backgroundColor: backGroundColor
              ? backGroundColor
              : Colors.inputBackground,
          },
        ]}
      >
        <TextInput
          ref={ref}
          onChange={onChangeValue}
          onChangeText={onChangeTextValue}
          {...props}
          style={[Common.textInput, Fonts.textRegular]}
          placeholderTextColor={applyOpacityToHexColor(Colors.textGray600, 0.6)}
          secureTextEntry={isSecure}
          testID="input_box"
        />
        {shouldShowTextCount && (
          <DivideByText
            title={`${totalTextCount + '/' + maximumTextCount}`}
            textColor={
              totalTextCount > maximumTextCount ||
              (totalTextCount > 0 && totalTextCount < minimumTextCount)
                ? Colors.textError
                : applyOpacityToHexColor(Colors.placeholderColor, 0.6)
            }
          />
        )}
        {rightIconPath !== undefined && (
          <CloseButton
            onPress={() => {
              if (isSecureText) {
                setSecure(!isSecure);
              } else {
                onPressRightIcon();
              }
            }}
            iconPath={!isSecure ? rightIconPath : Images.ic_eye_on}
          />
        )}
      </View>
      {isShowError ? (
        <ErrorView
          text={t(errMessage)}
          iconPath={Images.ic_error_tick}
          textColor={Colors.textError}
        />
      ) : null}

      {!isShowError && isShowMessage ? (
        <ErrorView
          text={message}
          iconPath={messageIcon}
          textColor={messageColor}
        />
      ) : null}
    </>
  );
});

InputBox.defaultProps = {
  totalTextCount: 0,
  minimumTextCount: 0,
  maximumTextCount: 0,
  borderColor: '',
  isShowError: false,
  errMessage: '',
  shouldShowTextCount: false,
  isShowMessage: false,
  message: '',
  messageColor: '',
  messageIcon: '',
  rightIconPath: undefined,
  isSecureText: false,
  onPressRightIcon: undefined,
  backGroundColor: '',
  onChangeValue: undefined,
  onChangeTextValue: undefined,
};

export default InputBox;
