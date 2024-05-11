import React from 'react';
import { View, Text, Image } from 'react-native';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import Variables from 'theme/Variables';
import { RecoveryOptionItem } from 'types/applicationInterfaces';

import { HorizontalSeparatorView, TagView, VerticalSeparatorView } from '..';
import { style } from './style';

type Props = {
  item: RecoveryOptionItem;
};
export default function RecoverySelectionCard(props: Props) {
  const { item } = props;
  const { description, image, tagText, title } = item;
  const { Fonts, Colors, Layout, Gutters } = useTheme();

  return (
    <View style={style(Gutters, Layout, Colors).container}>
      <View style={style(Gutters, Layout, Colors).leftView}>
        <View style={style(Gutters, Layout, Colors).titleAndTagWrapper}>
          <Text style={Fonts.textSmallBoldWhite}>{t(title as any)}</Text>
          <VerticalSeparatorView />
          <TagView text={t(tagText as any)} />
        </View>
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.extraTiny} />
        <Text style={Fonts.textSmallDescriptionRegular}>
          {t(description as any)}
        </Text>
      </View>
      <VerticalSeparatorView spacing={Variables.MetricsSizes.regular} />
      <View style={style(Gutters, Layout, Colors).rightView}>
        <Image
          style={style(Gutters, Layout, Colors).rightViewImage}
          source={image}
        />
      </View>
    </View>
  );
}
