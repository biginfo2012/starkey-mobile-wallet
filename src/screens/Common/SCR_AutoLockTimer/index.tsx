import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  SafeAreaWrapper,
  TimerRawItem,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import { updateSettingConfig } from 'store/userInfo';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import Variables from 'theme/Variables';
import mockData from 'theme/mockData';

import { style } from './style';

const AutoLockTimer = () => {
  const { Common, Gutters, Layout, Colors } = useTheme();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const autoLockTimer = useSelector(
    (state: RootState) =>
      state.userInfo.data.config.autoLockTimer / (60 * 1000),
  );

  const [minVal, setMinVal] = useState(autoLockTimer);
  const dispatch = useDispatch();

  const handleSave = () => {
    // covert time entered in minutes to milliseconds and then store it in redux store and it it will store 0 by default if no value set
    dispatch(
      updateSettingConfig({
        config: {
          autoLockTimer: minVal * 60 * 1000,
        },
      }),
    );
    navigation.goBack();
  };

  const renderTimerItem = ({ item }) => {
    return (
      <TimerRawItem
        time={item.time}
        onPress={() => {
          setMinVal(item.time);
        }}
        selectedTime={minVal}
      />
    );
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          title={t('setting:scr_title_auto_lock_timer')}
          subTitle={t('setting:timer_subtitle')}
          shouldHideBack={true}
          shouldShowCancel={true}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <View>
          <FlatList
            data={mockData.AutoLockTimer}
            keyExtractor={item => item.time.toString()}
            renderItem={renderTimerItem}
            scrollEnabled={false}
            contentContainerStyle={style(Gutters, Layout, Colors).flatListBG}
          />
        </View>
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <Button
          text={t('common:Save')}
          onPress={handleSave}
          colors={minVal === autoLockTimer && Colors.disableGradientColor}
          btnTextColor={
            minVal === autoLockTimer
              ? applyOpacityToHexColor(Colors.textGray600, 0.3)
              : undefined
          }
          disabled={minVal === autoLockTimer}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default AutoLockTimer;
