/* eslint-disable react/jsx-no-duplicate-props */
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useSelector } from 'react-redux';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  BottomViewTitleAndSubTitle,
  Button,
  ErrorView,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  InputBox,
  ProgressLineView,
  SafeAreaWrapper,
  VerticalSeparatorView,
} from 'components/index';
import { t } from 'i18next';
import KeyChainService from 'services/KeyChainService';
import EncodeDataAndStoreDataToFile from 'services/SeedPhraseFileEncoderService';
import { RootState } from 'store/index';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import { MaximumPasswordCharacters } from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import { ValidationSchema } from 'theme/index';
import ScreenNames from 'theme/screenNames';

import { useTheme } from '../../../hooks';
import { style } from './style';

type FormData = {
  password: string;
  confirmPassword: string;
};

const CreatePassword: React.FC<any> = () => {
  const { Gutters, Images, Layout, Colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const seedPhrase = useSelector(
    (state: RootState) => state.wallet.data.seedPhrase,
  );

  // Set up react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(ValidationSchema.createPassword),
  });

  /*
  Handle form submission
  Store the password in the device's KeyChain using KeyChainService
  Encode data and store it to a file using EncodeDataAndStoreDataToFile
*/
  const onSubmit = async (data: FormData) => {
    Keyboard.dismiss();
    await KeyChainService().storePasswordInKeyChain(data.password);
    await EncodeDataAndStoreDataToFile(2, 1, seedPhrase, true);
    navigation.navigate(ScreenNames.BackUpWalletUsingIcloud);
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={true}>
      <BackgroundView
        image={Images.background.ic_password_recovery_bg}
        isFullScreen={false}
      />
      <View style={style(Layout, Gutters).wrapperView}>
        <HeaderWithTitleAndSubTitle hasLargeTitle={false} />
      </View>

      <KeyboardAvoidingView
        style={Layout.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={scale(Platform.OS === 'ios' ? -25 : 0)}
      >
        <View style={style(Layout, Gutters).bottomView}>
          <BottomViewTitleAndSubTitle
            title={t('onBoarding:createPassword_title')}
            subTitle={t('onBoarding:createPassword_subTitle')}
            middleView={
              <>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: true,
                  }}
                  render={({ field: { value, onBlur } }) => (
                    <>
                      <InputBox
                        isShowError={errors?.password?.message ? true : false}
                        errMessage={errors?.password?.message}
                        placeholder={t('onBoarding:password')}
                        onBlur={onBlur}
                        value={value}
                        rightIconPath={Images.ic_eye_off}
                        isSecureText={true}
                        maxLength={MaximumPasswordCharacters}
                        backGroundColor={Colors.blackGray}
                        onEndEditing={() => {
                          setValue(
                            'password',
                            value.replace(/\s/g, '').trim(),
                            {
                              shouldValidate: true,
                            },
                          );
                        }}
                        onChangeTextValue={text => {
                          setValue('password', text.replace(/\s/g, '').trim(), {
                            shouldValidate: true,
                          });
                          resetField('confirmPassword');
                        }}
                      />
                      {!errors?.password?.message && !isValid && (
                        <ErrorView
                          text={t('onBoarding:min_9_characters')}
                          textColor={applyOpacityToHexColor(
                            Colors.textGray600,
                            0.6,
                          )}
                        />
                      )}
                    </>
                  )}
                />

                <HorizontalSeparatorView
                  spacing={Variables.MetricsSizes.regular}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onBlur, value } }) => (
                    <InputBox
                      isShowError={
                        errors?.confirmPassword?.message ? true : false
                      }
                      errMessage={errors?.confirmPassword?.message}
                      placeholder={t('onBoarding:confirm_password')}
                      onBlur={onBlur}
                      value={value}
                      rightIconPath={Images.ic_eye_off}
                      isSecureText={true}
                      contextMenuHidden={true}
                      maxLength={MaximumPasswordCharacters}
                      backGroundColor={Colors.blackGray}
                      onEndEditing={() => {
                        setValue('confirmPassword', value, {
                          shouldValidate: true,
                        });
                      }}
                      onChangeTextValue={text => {
                        setValue(
                          'confirmPassword',
                          text.replace(/\s/g, '').trim(),
                          {
                            shouldValidate: true,
                          },
                        );
                      }}
                    />
                  )}
                />
                <HorizontalSeparatorView
                  spacing={Variables.MetricsSizes.regular}
                />
                <View style={Layout.row}>
                  <ProgressLineView countLength={4} selectedCount={1} />
                  <VerticalSeparatorView
                    spacing={Variables.MetricsSizes.large}
                  />
                  <Button
                    text={t('common:Next')}
                    onPress={handleSubmit(onSubmit)}
                    btnStyle={Layout.fill}
                    colors={
                      (errors?.password ||
                        errors?.confirmPassword ||
                        !isValid) &&
                      Colors.disableGradientColor
                    }
                    btnTextColor={
                      errors?.password || errors?.confirmPassword || !isValid
                        ? Colors.buttonGrayText
                        : Colors.white
                    }
                  />
                </View>
              </>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default CreatePassword;
