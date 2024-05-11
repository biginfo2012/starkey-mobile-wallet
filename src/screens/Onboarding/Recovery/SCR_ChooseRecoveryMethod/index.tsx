import React from 'react';
import { View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  RecoverySelectionListView,
  SafeAreaWrapper,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import Variables from 'theme/Variables';
import mockData from 'theme/mockData';
import ScreenNames from 'theme/screenNames';

export default function ChooseRecoveryMethod() {
  const { Common, Images } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle title={t('common:Recovery_methods')} />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
        <RecoverySelectionListView
          onItemPress={item => {
            if (item.id === 1) {
              navigation.push(ScreenNames.DecryptFilePassword);
            } else if (item.id === 2) {
              navigation.push(ScreenNames.RecoveryUsingSecretPhrase);
            }
          }}
          data={mockData.recoveryOptions}
        />
      </View>
    </SafeAreaWrapper>
  );
}
