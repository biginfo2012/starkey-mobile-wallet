import React from 'react';
import { Image, Pressable, Text } from 'react-native';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';

import { style } from './style';

type Props = {
  item: any;
  onPress: () => void;
};

const BasicAccountsOptionsRawItem = (props: Props) => {
  const { Gutters, Layout, Fonts } = useTheme();

  const { item, onPress } = props;

  return (
    <Pressable
      testID="basic-accounts-options-raw-item-pressable"
      onPress={onPress}
      style={style(Gutters, Layout).rawRootContainer}
    >
      <Text style={Fonts.textSmallBoldWhite}>{t(item.title)}</Text>
      <Image
        testID="right_image"
        style={style(Gutters, Layout).image}
        resizeMode="contain"
        source={item.image}
      />
    </Pressable>
  );
};

export default BasicAccountsOptionsRawItem;
