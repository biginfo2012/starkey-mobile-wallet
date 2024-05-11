import React, { memo } from 'react';
import { Image, Text, View } from 'react-native';

import { t } from 'i18next';
import { USDollar, getRoundDecimalValue } from 'theme/Helper/common/Function';
import Variables from 'theme/Variables';

import { useTheme } from '../../hooks';
import VerticalSeparatorView from '../VerticalSeparatorView/VerticalSeparatorView';
import { style } from './styles';

type Props = {
  item: any;
  shouldShowBalance?: boolean;
};

const WalletTokenItem = ({ item, shouldShowBalance }: Props) => {
  const { Layout, Gutters, Fonts, Colors, Images } = useTheme();

  return (
    <View style={[style(Gutters, Layout).container]}>
      {item?.image ? (
        <Image
          style={style(Gutters, Layout).icon}
          resizeMode="contain"
          source={
            typeof item?.image === 'string' ? { uri: item?.image } : item?.image
          }
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
          <View style={style(Gutters, Layout).row}>
            <Text
              testID={item?.title}
              style={[Fonts.titleSmall]}
              numberOfLines={1}
            >
              {item?.title}
              <VerticalSeparatorView spacing={Variables.MetricsSizes.tiny} />
              <Text
                testID={item?.networkName}
                style={{ color: Colors.grayText }}
              >
                {item?.networkName}
              </Text>
            </Text>
            {item?.isFavorite && (
              <Image
                testID="star-icon"
                style={style(Gutters, Layout).starIcon}
                resizeMode="contain"
                source={Images.ic_fill_star}
              />
            )}
          </View>
          <Text style={[Fonts.textTinyGrayLightRegular]}>
            {item?.subTitle ?? item?.networkName}
          </Text>
        </View>
        <View style={style(Gutters, Layout, Colors).viewAmount}>
          <Text style={[Fonts.titleSmall]}>
            {!shouldShowBalance
              ? getRoundDecimalValue(item?.amount || 0) ?? '0'
              : t('common:hidden_symbol')}
          </Text>
          {item?.usdAmount > 0 && (
            <Text style={[Fonts.textTinyGrayLightRegular]}>
              {!shouldShowBalance
                ? USDollar().format(item?.amount * item?.usdAmount)
                : t('common:hidden_symbol')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

WalletTokenItem.defaultProps = {
  shouldShowBalance: false,
};

export default memo(WalletTokenItem);
