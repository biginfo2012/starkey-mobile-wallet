import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { t } from 'i18next';
import Variables from 'theme/Variables';

import { HorizontalSeparatorView } from '..';
import { useTheme } from '../../hooks';
import VerticalSeparatorView from '../VerticalSeparatorView/VerticalSeparatorView';
import { style } from './styles';

type Props = {
  title: string;
  amount: string;
  percentage: string;
  onPress: () => void;
  shouldShowBalance?: boolean;
};

const TokenPriceView = ({
  percentage,
  onPress,
  title,
  amount,
  shouldShowBalance,
}: Props) => {
  const { Layout, Fonts, Gutters, Colors, Images } = useTheme();

  return (
    <Pressable
      testID="button"
      onPress={() => {}}
      style={[style(Gutters, Layout, Colors).button]}
    >
      <View style={style(Gutters, Layout, Colors).textView}>
        <Text style={Fonts.textSmallBold} numberOfLines={1}>
          {title}
        </Text>
        {!shouldShowBalance ? (
          <Text style={[Fonts.textSmallMediumExtraBold]}>{amount}</Text>
        ) : (
          <Image
            style={style(Gutters, Layout, Colors).monkeyIconStyle}
            source={Images.ic_no_evil_monkey}
            resizeMode="contain"
          />
        )}
      </View>
      {percentage !== '0' ? (
        <>
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.tiny} />
          <View style={style(Gutters, Layout, Colors).textView}>
            <Text
              style={[
                Fonts.textSmallTinyWhiteMedium,
                {
                  color: Colors.textPurple,
                },
              ]}
              numberOfLines={1}
              onPress={onPress}
            >
              {t('wallet:view_price_chart')}
            </Text>

            <View style={[style(Gutters, Layout, Colors).viewTrending]}>
              <Image
                style={[
                  style(Gutters, Layout, Colors).icon,
                  parseFloat(percentage) < 0 && {
                    transform: [{ rotate: '180 deg' }],
                    tintColor: Colors.textError,
                  },
                ]}
                resizeMode="contain"
                source={Images.ic_trending_up_green}
              />
              <VerticalSeparatorView spacing={Variables.MetricsSizes.tiny} />
              <Text
                style={[
                  Fonts.textTinyRegular,
                  {
                    color:
                      parseFloat(percentage) >= 0
                        ? Colors.textSuccess
                        : Colors.textError,
                  },
                ]}
              >
                {percentage + '%'}
              </Text>
            </View>
          </View>
        </>
      ) : null}
    </Pressable>
  );
};

TokenPriceView.defaultProps = {
  shouldShowBalance: false,
};

export default TokenPriceView;
