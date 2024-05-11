import React, { useEffect, useState } from 'react';
import { View, FlatList, BackHandler, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  SafeAreaWrapper,
  TokenItem,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { AppDispatch, RootState } from 'store/index';
import {
  addRemoveTokenFromList,
  triggerFetchAllTokenBalanceAndStartObservers,
} from 'store/wallet';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import { style } from './style';

const ChooseNetwork: React.FC<any> = () => {
  const { Common, Images, Colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const isFocus = useIsFocused();
  const [networksListArray, setNetworksListArray] = useState([]);
  const [ERC20tokensList, setERC20tokensList] = useState([]);

  const tokensList = useSelector((state: RootState) => {
    return state.wallet.data.tokensList;
  });

  const { redirectFrom } = useRoute().params as {
    redirectFrom?: string;
  };

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

  useEffect(() => {
    navigation.addListener('transitionEnd', () => {
      if (!isFocus) {
        dispatch(triggerFetchAllTokenBalanceAndStartObservers());
      }
    });
  }, [navigation, isFocus]);

  useEffect(() => {
    if (redirectFrom === ScreenNames.CreateAccount) {
      setNetworksListArray(
        Object.values(tokensList).filter(item => item.tokenType === 'Native'),
      );
    } else {
      setERC20tokensList(
        Object.values(tokensList).filter(item => item.tokenType !== 'Native'),
      );
    }
  }, [tokensList]);

  /*
Redirect To DecryptFilePassword Screen
*/
  const redirectToNextScreen = () => {
    navigation.navigate(ScreenNames.BackUpFirstRecoveryPhrase, {
      isFromRevealSecretPhrase: false,
    });
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          title={
            redirectFrom === ScreenNames.CreateAccount
              ? t('onBoarding:chooseNetworks_title')
              : t('wallet:add_Token')
          }
          subTitle={
            redirectFrom === ScreenNames.CreateAccount
              ? t('onBoarding:chooseNetworks_subTitle')
              : t('wallet:chooseTokens_subTitle')
          }
          onPressNext={() => {
            if (redirectFrom === ScreenNames.CreateAccount) {
              navigation.navigate(ScreenNames.RecoveryVideo, {
                title: t('onBoarding:recoveryVideo_title'),
                subTitle: t('onBoarding:recoveryVideo_subTitle'),
                videoUrl:
                  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                btnText: t('common:Next'),
                redirectToNextScreen,
              });
            } else {
              navigation.goBack();
            }
          }}
          shouldHideBack={redirectFrom === ScreenNames.CreateAccount}
          rightButtonText={
            redirectFrom === ScreenNames.CreateAccount
              ? t('common:Next')
              : t('common:Done')
          }
          isNextDisabled={
            redirectFrom !== 'createAccount'
              ? false
              : selectedTokensList?.length !== 0
              ? false
              : true
          }
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <View style={style(Colors).subView}>
          <FlatList
            data={
              redirectFrom === ScreenNames.CreateAccount
                ? networksListArray
                : ERC20tokensList
            }
            bounces={false}
            keyExtractor={item => item.id}
            renderItem={({ item }: { item: ExistingNetworksItem }) => (
              <TokenItem
                title={
                  redirectFrom === ScreenNames.CreateAccount
                    ? item.subTitle
                    : item.title
                }
                subTitle={
                  redirectFrom === ScreenNames.CreateAccount
                    ? ''
                    : item.networkName
                }
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
      </View>
    </SafeAreaWrapper>
  );
};

export default ChooseNetwork;
