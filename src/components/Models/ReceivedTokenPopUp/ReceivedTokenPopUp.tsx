import React from 'react';
import { Image, ImageBackground, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { useSelector } from 'react-redux';

import AmountView from 'components/AmountView/AmountView';
import Button from 'components/Button/Button';
import HorizontalSeparatorView from 'components/HorizontalSeparatorView/HorizontalSeparatorView';
import TextButton from 'components/TextButton/TextButton';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import { dismissReceivedTokenModal } from 'theme/Helper/common/Function';
import Variables from 'theme/Variables';

import { style } from './styles';

const ReceivedTokenPopUp = ({}: Props) => {
  const { Layout, Gutters, Colors, Fonts } = useTheme();

  const data = useSelector((state: RootState) => {
    return state.popupModelReducer.data;
  });
  const {
    popupTitle,
    popupTitleValueParams,
    popupDescription,
    popupDescriptionValueParams,
    buttonOkText,
    buttonCancelText,
    onPressOk,
    onPressCancel,
    imagePath,
    iconPath,
    okButtonType,
    seconds,
    amount,
    usdAmount,
    tokenType,
    isFromAddToken,
  } = data;

  const gasList = [
    {
      id: 1,
      title: t('common:estimated_gas_fee'),
      amount: amount,
      usdAmount: usdAmount,
      tokenType: tokenType,
    },
    {
      id: 2,
      title: t('common:estimated_time'),
      amount: t('common:seconds', {
        seconds: seconds,
      }),
    },
  ];

  return (
    <ReactNativeModal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      isVisible={data?.isVisible}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
    >
      <View style={style(Gutters, Layout, Colors).container}>
        {!isFromAddToken && iconPath && (
          <Image
            style={style(Gutters, Layout, Colors).icon}
            source={iconPath}
          />
        )}
        {isFromAddToken && iconPath ? (
          <Image
            style={style(Gutters, Layout, Colors).icon}
            resizeMode="contain"
            source={typeof iconPath === 'string' ? { uri: iconPath } : iconPath}
          />
        ) : isFromAddToken ? (
          <View style={style(Gutters, Layout, Colors).textImage}>
            <Text style={[Fonts.titleMedium, { color: Colors.blackGray }]}>
              {String(popupTitle?.split(/\r?\n/)[1]?.[0] || '')}
            </Text>
          </View>
        ) : (
          <></>
        )}
        <Text style={[Fonts.titleMedium, Fonts.textCenter]}>
          {t(popupTitle, popupTitleValueParams)}
        </Text>
        {popupDescription && (
          <>
            <HorizontalSeparatorView
              spacing={Variables.MetricsSizes.extraTiny}
            />

            <Text style={[Fonts.textSmallRegular, Fonts.textCenter]}>
              {t(popupDescription, popupDescriptionValueParams)}
            </Text>
          </>
        )}

        {imagePath && (
          <ImageBackground
            style={style(Gutters, Layout, Colors).imgStyle}
            source={imagePath}
            resizeMode="contain"
          />
        )}

        {amount && (
          <>
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.regular} />
            <View style={style(Gutters, Layout, Colors).viewGasPrice}>
              {gasList?.map(item => (
                <AmountView
                  key={item?.id}
                  title={item?.title}
                  amount={item?.amount}
                  usdAmount={item?.usdAmount}
                  tokenType={item?.tokenType}
                />
              ))}
            </View>
          </>
        )}

        <HorizontalSeparatorView spacing={Variables.MetricsSizes.regular} />

        <Button
          testId={'receive-token-modal-button-ok'}
          text={t(buttonOkText)}
          onPress={() => {
            dismissReceivedTokenModal();
            setTimeout(() => {
              onPressOk();
            }, 500);
          }}
          colors={okButtonType !== 'primary' && Colors.disableGradientColor}
          btnStyle={style(Gutters, Layout, Colors).btnOk}
          btnTextColor={
            okButtonType === 'primary' ? Colors.white : Colors.textError
          }
        />

        {onPressCancel && (
          <TextButton
            testId={'receive-token-modal-button-cancel'}
            onPress={() => {
              dismissReceivedTokenModal();
              setTimeout(() => {
                onPressCancel();
              }, 500);
            }}
            text={t(buttonCancelText)}
            btnStyle={style(Gutters, Layout, Colors).btnCancel}
          />
        )}
      </View>
    </ReactNativeModal>
  );
};

ReceivedTokenPopUp.defaultProps = {
  popupDescription: '',
  buttonCancelText: '',
  imagePath: '',
  onPressCancel: '',
  okButtonType: 'primary',
};

export default ReceivedTokenPopUp;
