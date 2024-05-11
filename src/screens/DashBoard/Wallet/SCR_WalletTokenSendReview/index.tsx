import React, { useEffect, useId, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  Button,
  DashBoardHeader,
  ErrorView,
  HorizontalSeparatorView,
  ReviewGasPriceView,
  SafeAreaWrapper,
  TokenAmountWithImageView,
  UserAddressView,
} from 'components/index';
import dayjs from 'dayjs';
import { TransactionReceipt, TransactionRequest, ethers } from 'ethers';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import BiometricService from 'services/BiometricService';
import WalletCommonService from 'services/WalletCommonService';
import { storeRecentTransactionAddress } from 'store/addressBook';
import { AppDispatch, RootState } from 'store/index';
import { updateTokenTransactionDetails } from 'store/wallet';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import {
  USDollar,
  colorPalette,
  getRandomIndex,
  getRoundDecimalValue,
  getUserDataFromAddress,
  getWalletAddress,
  parseEther,
  showAlert,
  showConfirmationModal,
  showReceivedTokenModal,
  showToast,
} from 'theme/Helper/common/Function';
import { NetWorkType } from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import { navigationRef } from 'theme/navigationHelper';
import ScreenNames from 'theme/screenNames';
import { ActivityItemInterface } from 'types/apiResponseInterfaces';
import { PopUpItem, TokenReceivePopUpItem } from 'types/applicationInterfaces';

import { style } from './style';

type ParamsType = {
  amount: number;
  toAddress: string;
  estimatedGasFee: string;
  estimatedTimeRequired: string;
  estimatedGasFeeInGwei: any;
};
let transactionObj = {};
const WalletTokenSendReview: React.FC<any> = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  let isTransactionCancelledSuccess = false;
  const userInfo = useSelector((state: RootState) => state.userInfo.data);

  const { Common, Images, Gutters, Layout, Fonts, Colors } = useTheme();
  const {
    amount,
    toAddress,
    estimatedGasFee,
    estimatedTimeRequired,
    estimatedGasFeeInGwei,
  } = useRoute().params as ParamsType;

  const dispatch = useDispatch<AppDispatch>();

  const currentTokenInfo = useSelector((state: RootState) => {
    return state.wallet.data.currentSelectedToken;
  });

  const nativeCurrencyToken = useSelector((state: RootState) => {
    return currentTokenInfo?.tokenType === 'Native'
      ? currentTokenInfo
      : state.wallet.data.currentUserTokenArrayWithBalance[
          currentTokenInfo?.networkName
        ];
  });

  const [activityItemObj, setActivityItemObj] =
    useState<ActivityItemInterface>();
  const uniqTxtId = useId();

  const getFormattedWalletAddress = () => {
    return getWalletAddress(
      currentTokenInfo?.networkName,
      currentTokenInfo?.isEVMNetwork,
    );
  };

  useEffect(() => {
    setActivityItemObj({
      blockHash: '',
      blockNumber: '',
      confirmations: '',
      contractAddress: '',
      cumulativeGasUsed: '',
      from: getFormattedWalletAddress(),
      functionName: '',
      gas: '',
      gasPrice: '',
      gasUsed: '',
      hash: '',
      input: '',
      isError: '',
      methodId: '',
      nonce: '',
      timeStamp: `${dayjs().unix()}`,
      to: toAddress,
      transactionIndex: '',
      txreceipt_status: '2',
      value:
        currentTokenInfo?.title === NetWorkType.ETH
          ? parseEther(amount) + ''
          : amount * Math.pow(10, 6) + '',
      tokenDecimal: currentTokenInfo?.title === NetWorkType.ETH ? '' : '6',
      tokenName: '',
      tokenSymbol: '',
      id: uniqTxtId,
    });
  }, []);

  const onTransactionStart = async (data: TransactionRequest) => {
    transactionObj = data;

    const activitySuccessItemObj = {
      ...activityItemObj,
      txreceipt_status: '2',
      transactionObj: data,
    };
    dispatch(updateTokenTransactionDetails(activitySuccessItemObj));
  };

  const onTransactionDone = (
    transaction: TransactionReceipt | null | undefined | string,
  ) => {
    const activitySuccessItemObj = {
      ...activityItemObj,
      blockHash: transaction?.blockHash,
      blockNumber: transaction?.blockNumber,
      gasPrice: transaction?.gasPrice + '',
      gasUsed: transaction?.gasUsed + '',
      hash: transaction?.hash,
      txreceipt_status: transaction?.status + '',
    };

    dispatch(updateTokenTransactionDetails(activitySuccessItemObj));

    let popUpObj = {
      type: 'tokenSend',
      symbol: currentTokenInfo?.title,
      tokenObj: currentTokenInfo,
      isExists: true,
      amount: amount,
      onPressOk: callOk,
      onPressCancel: onPressCancel,
    } as TokenReceivePopUpItem;
    showReceivedTokenModal(popUpObj);
  };

  const onTransactionFail = (
    _transaction: TransactionReceipt | null | undefined | string,
  ) => {
    if (isTransactionCancelledSuccess) {
      return;
    }
    const activityFailItemObj = {
      ...activityItemObj,
      txreceipt_status: '3',
    };

    dispatch(updateTokenTransactionDetails(activityFailItemObj));

    const popUpObj = {
      isVisible: true,
      popupTitle: t('common:Transaction_was_failed'),
      popupDescription: _transaction,
      buttonOkText: t('common:ok'),
      okButtonType: 'primary',
      onPressOk: callOk,
      iconPath: currentTokenInfo?.image as any,
      isFromAddToken: true,
    } as PopUpItem;
    showConfirmationModal(popUpObj);
  };

  const onTransactionCancelStart = async (_data: TransactionRequest) => {};

  const onTransactionCancelDone = (
    _transaction: TransactionReceipt | null | undefined,
  ) => {
    isTransactionCancelledSuccess = true;
    showAlert('', t('wallet:transaction_cancelled_successfully'));
    const activityCancelItemObj = {
      ...activityItemObj,
      txreceipt_status: '4',
    };

    dispatch(updateTokenTransactionDetails(activityCancelItemObj));
  };

  const onTransactionCancelFail = (
    _transaction: TransactionReceipt | null | undefined | string,
  ) => {
    showAlert('', t('wallet:transaction_cancelled_successfully'));
  };

  const callOk = () => {
    if (
      navigationRef.current.getCurrentRoute().name ===
      ScreenNames.ActivityDetails
    ) {
      navigation.navigate(ScreenNames.TokenDetails);
    }
  };

  const onPressCancel = () => {};

  const sendERC20Token = () => {
    WalletCommonService().sendErc20Token(
      toAddress,
      Number(amount),
      onTransactionStart,
      onTransactionDone,
      onTransactionFail,
      currentTokenInfo,
      estimatedGasFeeInGwei,
      0,
    );
  };

  const sendToken = () => {
    WalletCommonService().sendNativeToken(
      toAddress,
      amount.toString(),
      estimatedGasFeeInGwei,
      0,
      onTransactionStart,
      onTransactionDone,
      onTransactionFail,
      currentTokenInfo,
    );
  };

  const cancelTransaction = () => {
    WalletCommonService().sendNativeToken(
      toAddress,
      amount.toString(),
      0,
      0,
      onTransactionCancelStart,
      onTransactionCancelDone,
      onTransactionCancelFail,
      currentTokenInfo,
      true,
      {
        to: ethers.ZeroAddress,
        data: '0x',
        gasLimit: transactionObj?.gasLimit,
        gasPrice: transactionObj?.gasPrice,
        nonce: transactionObj?.nonce,
      },
    );
  };

  const addRecentTransactionInBook = () => {
    dispatch(
      storeRecentTransactionAddress({
        data: {
          address: toAddress,
          networkShortName: currentTokenInfo?.shortName,
          profileIcon: colorPalette[getRandomIndex(colorPalette.length)],
          userId: userInfo.currentUserId,
        },
      }),
    );
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView
        image={Images.background.ic_backgroundGradientWalletLayer}
      />
      <View style={Common.containerFillWithSmallHPadding}>
        <DashBoardHeader
          leftImage={Images.ic_back}
          onPressLeftImage={() => {
            navigation.goBack();
          }}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
        <TokenAmountWithImageView
          title={t('common:Send')}
          iconPath={currentTokenInfo?.image}
          amount={amount}
          usdAmount={amount * currentTokenInfo?.usdAmount}
          tokenType={currentTokenInfo?.title}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

        <View style={style(Gutters, Colors).viewCenter}>
          <Text style={[Fonts.textSmallDescriptionBold, Layout.fullWidth]}>
            {t('common:to')}
          </Text>
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
          <UserAddressView
            walletAddress={toAddress}
            userName={getUserDataFromAddress(toAddress)?.userName}
            iconPath={getUserDataFromAddress(toAddress)?.profileIcon}
          />
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.tiny} />

          <ErrorView
            text={currentTokenInfo?.networkName + ' ' + t('wallet:network')}
            textColor={applyOpacityToHexColor(Colors.textGray600, 0.6)}
            textStyle={[Fonts.textTinyDescriptionRegular, Layout.fill]}
          />
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.tiny} />
          <ReviewGasPriceView
            gasAmount={
              currentTokenInfo?.isEVMNetwork
                ? estimatedGasFee.toFixed(14)
                : getRoundDecimalValue(estimatedGasFee, 8) ?? '0'
            }
            seconds={estimatedTimeRequired}
            gasUsdAmount={USDollar(9).format(
              estimatedGasFee * currentTokenInfo?.usdAmount,
            )}
            totalAmount={
              currentTokenInfo?.tokenType === 'Native'
                ? getRoundDecimalValue(
                    Number(estimatedGasFee) + Number(amount),
                    14,
                  ) +
                  ' ' +
                  currentTokenInfo?.title
                : estimatedGasFee.toFixed(12) +
                  ' ' +
                  currentTokenInfo?.networkName +
                  ' + ' +
                  amount +
                  ' ' +
                  currentTokenInfo?.title
            }
            totalUsdAmount={USDollar(9).format(
              estimatedGasFee * nativeCurrencyToken?.usdAmount +
                amount * currentTokenInfo?.usdAmount,
            )}
            tokenType={nativeCurrencyToken?.title}
          />
        </View>
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <Button
          text={t('common:Send')}
          onPress={async () => {
            if (userInfo.config.isFaceIdEnabledForTransaction === true) {
              const response = await BiometricService.authenticate(
                'Authenticate using biometric',
              );
              if (!response.success) {
                showToast('error', t('common:invalid_authentication'));
                return;
              }
            }
            dispatch(updateTokenTransactionDetails(activityItemObj));
            addRecentTransactionInBook();
            navigation.navigate(ScreenNames.ActivityDetails, {
              isFrom: 'send',
              activityItemObj: {},
              sendToken:
                currentTokenInfo?.tokenType === 'ERC20'
                  ? sendERC20Token
                  : sendToken,
              cancelTransaction: cancelTransaction,
            });
          }}
          btnStyle={Layout.fullWidth}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default WalletTokenSendReview;
