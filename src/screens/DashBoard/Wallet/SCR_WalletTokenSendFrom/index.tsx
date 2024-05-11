import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  DashBoardHeader,
  HorizontalSeparatorView,
  SafeAreaWrapper,
  TitleWithLeftImageView,
  UserAddressView,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import { getWalletAddress } from 'theme/Helper/common/Function';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';

const WalletTokenSendFrom: React.FC<any> = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const userData = useSelector((state: RootState) => {
    return state.userInfo.data.currentUser;
  });

  const currentTokenInfo = useSelector((state: RootState) => {
    return state.wallet.data.currentSelectedToken;
  });

  const { Common, Images, Fonts } = useTheme();

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <View style={Common.containerFillWithSmallHPadding}>
        <DashBoardHeader
          leftImage={Images.ic_back}
          onPressLeftImage={() => {
            navigation.goBack();
          }}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
        <TitleWithLeftImageView
          title={t('common:Send') + ' ' + currentTokenInfo?.title}
          iconPath={currentTokenInfo?.image}
          tokenName={currentTokenInfo?.title}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.regular} />
        <Text style={[Fonts.textSmallDescriptionBold]}>{t('common:from')}</Text>
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
        <UserAddressView
          walletAddress={getWalletAddress(
            currentTokenInfo?.networkName,
            currentTokenInfo?.isEVMNetwork,
          )}
          userName={userData?.userName}
          iconPath={userData?.profileIcon}
        />

        <HorizontalSeparatorView spacing={Variables.MetricsSizes.semiLarge} />
        <Button
          text={t('common:Next')}
          onPress={() => {
            navigation.navigate(ScreenNames.WalletTokenSendTo);
          }}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default WalletTokenSendFrom;
