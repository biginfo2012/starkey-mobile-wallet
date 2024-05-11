import React, { memo } from 'react';
import { Image, Text, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { scale } from 'react-native-size-scaling';

import Variables from 'theme/Variables';

import { useTheme } from '../../hooks';
import VerticalSeparatorView from '../VerticalSeparatorView/VerticalSeparatorView';
import { style } from './style';

type Props = {
  item: any;
  selected: boolean;
  onSelect: (id: string) => void;
};

const AddTokenItem = (props: Props) => {
  const { Layout, Gutters, Fonts, Colors } = useTheme();

  const { item, selected, onSelect } = props;

  return (
    <View style={[style(Gutters, Layout).container]}>
      {item?.image ? (
        <Image
          style={style(Gutters, Layout).icon}
          resizeMode="contain"
          source={item?.image}
        />
      ) : (
        <View style={style(Gutters, Layout, Colors).textImage}>
          <Text style={[Fonts.titleSmall, { color: Colors.blackGray }]}>
            {`${item?.title?.split(' ')[0][0]}`}
          </Text>
        </View>
      )}

      <View style={style(Gutters, Layout).subView}>
        <View style={[Layout.fill]}>
          <View style={Layout.row}>
            <Text style={[Fonts.titleSmall]} numberOfLines={1}>
              {item?.title}
            </Text>
            {item?.tokenType === 'ERC20' && (
              <>
                <VerticalSeparatorView spacing={Variables.MetricsSizes.tiny} />
                <Text
                  numberOfLines={1}
                  style={{ ...Fonts.titleSmall, color: Colors.grayText }}
                >
                  {item?.networkName}
                </Text>
              </>
            )}
          </View>
          <Text style={[Fonts.textTinyGrayLightRegular]}>{item?.subTitle}</Text>
        </View>
      </View>
      <View style={style(Gutters, Layout).checkBox}>
        <BouncyCheckbox
          testID="bouncy-checkbox"
          isChecked={selected}
          disableBuiltInState
          iconImageStyle={{ tintColor: Colors.blackGray }}
          fillColor={Colors.textPurple}
          innerIconStyle={{ borderColor: Colors.white }}
          size={scale(18)}
          onPress={() => onSelect(item.id)}
        />
      </View>
    </View>
  );
};

export default memo(AddTokenItem);
