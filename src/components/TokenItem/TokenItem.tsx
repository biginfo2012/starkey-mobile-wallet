import React, { memo } from 'react';
import { Image, Text, View } from 'react-native';

import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import { useTheme } from '../../hooks';
import CustomToggleSwitch from '../CustomToggleSwitch/CustomToggleSwitch';
import ListSeparatorView from '../ListSeparatorView/ListSeparatorView';
import { style } from './styles';

type Props = {
  item: ExistingNetworksItem;
  isEnabled: boolean;
  onPress: (item: ExistingNetworksItem) => void;
  title: string;
  subTitle?: string;
};

const TokenItem = ({ item, isEnabled, onPress, subTitle, title }: Props) => {
  const { Layout, Gutters, Fonts } = useTheme();

  return (
    <>
      <View style={style(Gutters, Layout).container}>
        <Image
          style={style(Gutters, Layout).icon}
          resizeMode="contain"
          source={item?.image}
        />
        <View style={[Layout.fill, Layout.justifyContentCenter]}>
          <Text style={[Fonts.titleSmall]}>{title}</Text>
          {subTitle && (
            <Text style={[Fonts.textTinyGrayLightRegular]}>{subTitle}</Text>
          )}
        </View>
        <CustomToggleSwitch
          isEnabled={isEnabled}
          onPress={() => {
            onPress(item);
          }}
        />
      </View>
      <ListSeparatorView />
    </>
  );
};

TokenItem.defaultProps = {
  subTitle: '',
};

export default memo(TokenItem);
