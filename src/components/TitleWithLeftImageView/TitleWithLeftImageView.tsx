import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';

import useTheme from 'hooks/useTheme';

import VerticalSeparatorView from '../VerticalSeparatorView/VerticalSeparatorView';
import { style } from './style';

type Props = {
  iconPath: ImageSourcePropType;
  title: string;
  alignment?: 'left' | 'center' | 'right';
  tokenName?: string;
};

export default function TitleWithLeftImageView({
  iconPath,
  title,
  alignment,
  tokenName,
}: Props) {
  const { Layout, Gutters, Fonts, Colors } = useTheme();
  return (
    <View
      style={
        alignment === 'left'
          ? { ...Layout.rowHCenter }
          : alignment === 'center'
          ? { ...Layout.rowCenter, ...Gutters.tinyHMargin }
          : { ...Layout.row, ...Layout.justifyContentEnd }
      }
    >
      {iconPath ? (
        <Image
          style={style(Gutters, Layout, Fonts).icon}
          source={typeof iconPath === 'string' ? { uri: iconPath } : iconPath}
        />
      ) : (
        <View style={style(Gutters, Layout, Fonts, Colors).textImage}>
          <Text style={[Fonts.titleSmall, { color: Colors.blackGray }]}>
            {tokenName?.[0]}
          </Text>
        </View>
      )}
      <VerticalSeparatorView />
      <View style={Layout.fillShrink}>
        <Text
          style={{ ...Fonts.textLarge, ...Gutters.tinyRPadding }}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
TitleWithLeftImageView.defaultProps = {
  alignment: 'left',
  tokenName: '',
};
