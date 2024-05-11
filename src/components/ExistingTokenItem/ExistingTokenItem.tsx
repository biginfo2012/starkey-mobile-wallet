import React from 'react';
import { Image, Text, View } from 'react-native';

import { USDollar } from 'theme/Helper/common/Function';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import { useTheme } from '../../hooks';
import CustomToggleSwitch from '../CustomToggleSwitch/CustomToggleSwitch';
import ListSeparatorView from '../ListSeparatorView/ListSeparatorView';
import { style } from './styles';

type Props = {
  item: ExistingNetworksItem;
  isEnabled: boolean;
  onPress: (item: ExistingNetworksItem) => void;
};

const ExistingTokenItem = ({ item, isEnabled, onPress }: Props) => {
  const { Layout, Gutters, Fonts } = useTheme();

  return (
    <>
      <View style={style(Gutters, Layout).container}>
        <Image
          style={style(Gutters, Layout).icon}
          resizeMode="contain"
          source={item?.image}
        />
        <View style={style(Gutters, Layout).subView}>
          <View style={[Layout.fill]}>
            <Text style={[Fonts.titleSmall]}>{item?.title}</Text>
            <Text style={[Fonts.textTinyGrayLightRegular]}>
              {item?.subTitle}
            </Text>
          </View>
          <View style={[Layout.fill, Layout.alignItemsEnd]}>
            <Text style={[Fonts.titleSmall]}>{item?.amount}</Text>
            <Text style={[Fonts.textTinyGrayLightRegular]}>
              {USDollar().format(parseFloat(item?.usdAmount))}
            </Text>
          </View>
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

export default ExistingTokenItem;
