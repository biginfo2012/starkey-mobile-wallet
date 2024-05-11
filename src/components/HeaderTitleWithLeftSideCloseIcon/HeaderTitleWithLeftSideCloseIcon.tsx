import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';

import useTheme from 'hooks/useTheme';

import { style } from './styles';

type Props = {
  onPressLeft: () => void;
  title: string;
};

const HeaderTitleWithLeftSideCloseIcon = (props: Props) => {
  const { Gutters, Fonts, Images, Layout } = useTheme();

  const { onPressLeft, title } = props;

  return (
    <View>
      <Pressable onPress={onPressLeft} style={style(Gutters, Layout).container}>
        <Image
          style={style(Gutters, Layout).icon}
          source={Images.ic_round_close}
          resizeMode={'contain'}
        />
      </Pressable>

      <Text style={[Fonts.textLarge, Gutters.smallVMargin]}>{title}</Text>
    </View>
  );
};

export default HeaderTitleWithLeftSideCloseIcon;
