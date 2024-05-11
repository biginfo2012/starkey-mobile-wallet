import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-scaling';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';

import { style } from './style';

type Props = {
  isDoneButtonEnabled: boolean;
  titleText: string;
  doneBtnText: string;
  onClearPress: () => void;
  onDonePress: () => void;
};

export default function FilterSortingHeader(props: Props) {
  const {
    isDoneButtonEnabled,
    titleText,
    onDonePress,
    doneBtnText,
    onClearPress,
  } = props;
  const { Fonts, Colors, Layout, Gutters } = useTheme();

  return (
    <View style={{ ...Layout.row, ...Gutters.regularBMargin }}>
      <TouchableOpacity onPress={onClearPress} style={{ width: scale(50) }}>
        <Text style={Fonts.textSmallBold}>
          {isDoneButtonEnabled ? t('common:Clear') : ''}
        </Text>
      </TouchableOpacity>

      <Text style={style(Gutters, Layout, Colors, Fonts).titleText}>
        {titleText}
      </Text>
      <TouchableOpacity
        disabled={!isDoneButtonEnabled}
        onPress={onDonePress}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ opacity: isDoneButtonEnabled ? 1 : 0.5, width: scale(50) }}
      >
        <Text style={Fonts.textSmallBold}>{t(doneBtnText)}</Text>
      </TouchableOpacity>
    </View>
  );
}
