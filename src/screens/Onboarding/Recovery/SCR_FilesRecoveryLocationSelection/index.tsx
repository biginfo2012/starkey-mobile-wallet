import React, { useState } from 'react';
import { View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  Button,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  SafeAreaWrapper,
  SelectionListView,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import Variables from 'theme/Variables';
import { mockData } from 'theme/mockData';
import ScreenNames from 'theme/screenNames';

import { style } from './style';

export default function FilesRecoveryLocationSelection() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { Gutters, Layout, Images, Colors } = useTheme();
  const [currentSelectedIds, setCurrentSelectedIds] = useState<string[]>([]);

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <View style={style(Gutters, Layout).wrapperView}>
        <HeaderWithTitleAndSubTitle
          title={t('onBoarding:FilesRecoveryLocationSelection_title')}
          subTitle={t('onBoarding:FilesRecoveryLocationSelection_subTitle')}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <View>
          <SelectionListView
            selectedItemsId={currentSelectedIds}
            flatListStyle={{ backgroundColor: Colors.inputBackground }}
            items={mockData.fileRecoveryOptions}
            multiSelect={true}
            maxAllowedItemToSelect={2}
            shouldHideHeader={true}
            onFilterUpdate={itemIds => {
              setCurrentSelectedIds(itemIds);
            }}
            customImageStyle={style(Gutters, Layout).customImage}
          />
        </View>
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <Button
          text={t('common:Next')}
          onPress={async () => {
            const arrData = mockData.fileRecoveryOptions.filter(item =>
              currentSelectedIds.includes(item.id),
            );
            if (currentSelectedIds?.length < 2) {
              return;
            }
            navigation.navigate(ScreenNames.FileRecovery, {
              selectedRecoveryOptions: arrData,
            });
          }}
          colors={currentSelectedIds?.length < 2 && Colors.disableGradientColor}
          btnTextColor={
            currentSelectedIds?.length < 2
              ? Colors.buttonGrayText
              : Colors.white
          }
        />
      </View>
    </SafeAreaWrapper>
  );
}
