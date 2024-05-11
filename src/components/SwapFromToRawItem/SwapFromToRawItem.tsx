import React from 'react';
import { View, Text, Image } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { scale } from 'react-native-size-scaling';

import useTheme from 'hooks/useTheme';
import { USDollar, getRoundDecimalValue } from 'theme/Helper/common/Function';

import { style } from './style';

type Props = {
  item: Object;
  selectedId: any;
  onPress: () => void;
};

const SwapFromToRawItem = (props: Props) => {
  const { item, selectedId, onPress } = props;
  const { Gutters, Layout, Colors, Fonts } = useTheme();

  return (
    <>
      <Image
        style={style(Gutters, Layout).icon}
        resizeMode="contain"
        source={item?.image}
      />
      <View style={style(Gutters, Layout).subView}>
        <View style={[Layout.fill]}>
          <Text style={[Fonts.titleSmall]} numberOfLines={1}>
            {item?.title}
            {/* <VerticalSeparatorView spacing={Variables.MetricsSizes.tiny} />
              <Text style={{ color: Colors.grayText }}>
                {item?.networkName}
              </Text> */}
          </Text>
          <Text style={[Fonts.textTinyGrayLightRegular]}>{item?.subTitle}</Text>
        </View>
        <View style={[Layout.alignItemsEnd]}>
          <Text style={[Fonts.titleSmall]}>
            {getRoundDecimalValue(item?.amount) ?? '0'}
          </Text>
          <Text style={[Fonts.textTinyGrayLightRegular]}>
            {USDollar().format(item?.amount * item?.usdAmount)}
          </Text>
        </View>
      </View>
      <View style={style(Gutters, Layout).checkBox}>
        <BouncyCheckbox
          isChecked={selectedId === item?.id}
          disableBuiltInState
          iconImageStyle={{ tintColor: Colors.blackGray }}
          fillColor={Colors.textPurple}
          innerIconStyle={{ borderColor: Colors.white }}
          size={scale(18)}
          onPress={onPress}
        />
      </View>
    </>
  );
};

export default SwapFromToRawItem;
