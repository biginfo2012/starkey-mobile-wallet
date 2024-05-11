import React, { Dispatch, SetStateAction, ReactElement } from 'react';
import { Text, Image, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../hooks';
import { style } from './style';

type Props = {
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  text: string | ReactElement;
};

const CheckBoxView = ({ isChecked, setIsChecked, text }: Props) => {
  const { Fonts, Gutters, Images, Layout } = useTheme();

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };
  return (
    <>
      <View style={style(Layout).container}>
        <TouchableOpacity
          testID="checkbox-view"
          style={Gutters.tinyRMargin}
          onPress={handleCheck}
        >
          <Image
            style={style(Layout).icon}
            source={
              isChecked ? Images.ic_check_primary : Images.ic_uncheck_black
            }
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={[Fonts.textTinyBoldWhite, Layout.fill]}>{text}</Text>
      </View>
    </>
  );
};

export default CheckBoxView;
