import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import Variables from 'theme/Variables';

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

const ProfitLossPriceView = ({
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
      onPress={onPress}
      style={[style(Gutters, Layout, Colors).button]}
    >
      <Text
        style={[
          Fonts.textSmallBold,
          {
            color: applyOpacityToHexColor(Colors.textGray600, 0.6),
          },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
      {!shouldShowBalance ? (
        <Text
          style={[
            {
              ...Fonts.textSmallMediumExtraBold,
              ...Gutters.smallBMargin,
              ...Gutters.extraTinyTMargin,
            },
          ]}
        >
          {amount}
        </Text>
      ) : (
        <Image
          style={style(Gutters, Layout, Colors).monkeyIconStyle}
          source={Images.ic_no_evil_monkey}
          resizeMode="contain"
        />
      )}
      {percentage !== '0' ? (
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
      ) : null}
    </Pressable>
  );
};

ProfitLossPriceView.defaultProps = {
  shouldShowBalance: false,
};

export default ProfitLossPriceView;
