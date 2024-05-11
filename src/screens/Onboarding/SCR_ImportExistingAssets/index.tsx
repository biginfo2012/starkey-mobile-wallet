import React, { useEffect } from 'react';
import { View, FlatList, BackHandler, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  ExistingTokenItem,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  SafeAreaWrapper,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import { addRemoveTokenFromList } from 'store/wallet';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import { style } from './style';

const ImportExistingAssets: React.FC<any> = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch();
  const { Common, Images, Colors } = useTheme();
  const { redirectFrom } = useRoute().params as any;

  const tokensList = useSelector((state: RootState) => {
    return state.wallet.data.tokensList;
  });

  const selectedTokensList = useSelector((state: RootState) => {
    return state.wallet.data.selectedTokensList;
  });

  useEffect(() => {
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', backAction);
    return () =>
      Platform.OS === 'android' &&
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const backAction = () => {
    return true;
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          shouldHideBack={true}
          title={t('onBoarding:importExistingAssets_title')}
          subTitle={t('onBoarding:importExistingAssets_subTitle')}
          onPressNext={() => {
            navigation.push(ScreenNames.ActionComplete, {
              title:
                redirectFrom === ScreenNames.CreateAccount
                  ? t('onBoarding:congratulations_title')
                  : t('onBoarding:you_are_all_good'),
              subTitle:
                redirectFrom === ScreenNames.CreateAccount
                  ? t('onBoarding:your_wallet_has_been_created')
                  : t('onBoarding:your_wallet_has_been_imported'),
              redirectToNextScreen: () => {},
              shouldShowAnimation: true,
            });
          }}
          isNextDisabled={selectedTokensList?.length !== 0 ? false : true}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <FlatList
          showsVerticalScrollIndicator={false}
          style={style(Colors).subView}
          data={Object.values(tokensList)}
          keyExtractor={item => item.id}
          bounces={false}
          renderItem={({ item }: { item: ExistingNetworksItem }) => (
            <ExistingTokenItem
              item={item}
              isEnabled={selectedTokensList?.includes(item.id)}
              onPress={itemObj => {
                dispatch(
                  addRemoveTokenFromList({
                    token: itemObj,
                  }),
                );
              }}
            />
          )}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default ImportExistingAssets;
