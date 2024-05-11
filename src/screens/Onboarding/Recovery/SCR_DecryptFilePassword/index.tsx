import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  Button,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  InputBox,
  SafeAreaWrapper,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import KeyChainService from 'services/KeyChainService';
import { MaximumPasswordCharacters } from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import { ValidationSchema } from 'theme/index';
import ScreenNames from 'theme/screenNames';

type FormData = {
  password: string;
};

const DecryptFilePassword: React.FC<any> = () => {
  const { Common, Images, Colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  // Set up react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      password: '',
    },
    resolver: yupResolver(ValidationSchema.password),
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    Keyboard.dismiss();
    await KeyChainService().storePasswordInKeyChain(data?.password);
    navigation.navigate(ScreenNames.FilesRecoveryLocationSelection);
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />

      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          title={t('onBoarding:decryptFilePassword_title')}
          subTitle={t('onBoarding:decryptFilePassword_subTitle')}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <Controller
          control={control}
          name="password"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <>
              <InputBox
                onChangeText={onChange}
                isShowError={errors?.password?.message ? true : false}
                errMessage={errors?.password?.message}
                placeholder={t('onBoarding:password')}
                onBlur={onBlur}
                value={value}
                rightIconPath={Images.ic_eye_off}
                isSecureText={true}
                maxLength={MaximumPasswordCharacters}
                onEndEditing={() => {
                  setValue('password', value, {
                    shouldValidate: true,
                  });
                }}
              />
              <HorizontalSeparatorView
                spacing={Variables.MetricsSizes.medium}
              />
              <Button
                text={t('common:Next')}
                colors={!isValid && Colors.disableGradientColor}
                onPress={handleSubmit(onSubmit)}
                btnTextColor={isValid ? Colors.white : Colors.buttonGrayText}
              />
            </>
          )}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default DecryptFilePassword;
