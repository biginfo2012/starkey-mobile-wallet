import React from 'react';
import { Image, Pressable, Text } from 'react-native';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';

import { style } from './style';

type Props = {
  time: number;
  onPress: () => void;
  selectedTime: number;
};

const TimerRawItem = (props: Props) => {
  const { Gutters, Layout, Fonts, Images } = useTheme();

  const { time, onPress, selectedTime } = props;

  return (
    <Pressable
      testID="timer-options-raw-item-pressable"
      onPress={onPress}
      style={style(Gutters, Layout).rawRootContainer}
    >
      <Text style={[Fonts.textSmallBoldWhite, Gutters.tinyMediumVPadding]}>
        {time + t('setting:mins')}
      </Text>
      {time === selectedTime && (
        <Image
          style={style(Gutters, Layout).image}
          resizeMode="contain"
          source={Images.ic_purple_tick}
        />
      )}
    </Pressable>
  );
};

export default TimerRawItem;
