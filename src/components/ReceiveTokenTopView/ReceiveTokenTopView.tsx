/* eslint-disable react/require-default-props */
import React, { forwardRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useSelector } from 'react-redux';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import { formatAddress } from 'theme/Helper/Address';
import Variables from 'theme/Variables';

import {
  TitleWithLeftImageView,
  HorizontalSeparatorView,
  QrCodeView,
  TokenAction,
  UserProfileView,
} from '..';
import { style } from './style';

type Props = {
  qrCodeText: string;
  walletAddress: string;
  onSavePress: () => void;
  onCopyPress: () => void;
  onSharePress: () => void;
  containerStyle?: ViewStyle;
  tokenIconPath: ImageSourcePropType;
  networkName: string;
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  tokenName?: string;
};
const ReceiveTokenTopView = forwardRef((props: Props, ref) => {
  const {
    qrCodeText,
    walletAddress,
    containerStyle,
    onSavePress,
    onCopyPress,
    onSharePress,
    tokenIconPath,
    networkName,
    activeTab,
    tokenName,
  } = props;
  const { Colors, Images, Gutters, Layout, Fonts } = useTheme();

  const userData = useSelector((state: RootState) => {
    return state.userInfo.data.currentUser;
  });

  return (
    <View style={[style(Gutters, Layout, Colors).container, containerStyle]}>
      <ImageBackground
        style={style(Gutters, Layout, Colors).topImageBgView}
        resizeMode="stretch"
        source={Images.ic_receiveTokenTopViewBg}
      >
        <TitleWithLeftImageView
          title={`${t('common:Receive')} ${networkName}`}
          tokenName={tokenName}
          iconPath={tokenIconPath}
          alignment="center"
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

        {activeTab === 0 && (
          <QrCodeView ref={ref} size={scale(140)} value={qrCodeText} />
        )}

        {activeTab === 1 && <UserProfileView ref={ref} size={scale(152)} />}

        <HorizontalSeparatorView spacing={Variables.MetricsSizes.regular} />
        <Text
          style={{
            ...Fonts.textRegularBold,
          }}
        >
          {activeTab === 0
            ? formatAddress(walletAddress, 'short')
            : userData?.userName}
        </Text>
      </ImageBackground>
      <View style={style(Gutters, Layout, Colors).actionsContainer}>
        <TokenAction
          text={t('common:Save')}
          iconPath={Images.ic_save}
          onPress={onSavePress}
        />
        <TokenAction
          text={t('common:Copy')}
          iconPath={Images.ic_copy}
          onPress={onCopyPress}
        />
        <TokenAction
          text={t('common:Share')}
          iconPath={Images.ic_share}
          onPress={onSharePress}
        />
      </View>
    </View>
  );
});
export default ReceiveTokenTopView;
