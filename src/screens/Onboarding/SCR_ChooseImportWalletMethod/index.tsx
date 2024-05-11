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

export default function ChooseImportWalletMethod() {
  const { Common, Images } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          shouldHideBack={true}
          shouldShowCancel={true}
          title={t('onBoarding:chooseImportWalletMethod_title')}
          subTitle={t('onBoarding:chooseImportWalletMethod_subTitle')}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
        <RecoverySelectionListView
          onItemPress={item => {
            navigation.navigate(ScreenNames.ImportWallet, {
              redirectFrom:
                item.id === 1
                  ? t('onBoarding:by_secret_recovery_phrase')
                  : t('onBoarding:by_private_key'),
            });
          }}
          data={mockData.importWalletOptions}
        />
      </View>
    </SafeAreaWrapper>
  );
}
