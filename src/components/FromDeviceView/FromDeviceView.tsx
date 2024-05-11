import React from 'react';
import { Text, View } from 'react-native';

import { t } from 'i18next';
import Variables from 'theme/Variables';

import {
  Button,
  ErrorView,
  FilePath,
  HorizontalSeparatorView,
  TitleDescriptionView,
} from '..';
import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  title: string;
  filePath?: any[];
  buttonName: string;
  onPress: () => void;
  onPressClose?: (item: any) => void;
  shouldShowUserCloudID?: boolean;
  shouldShowError?: boolean;
  subTitle?: string;
  cloudRecoveryStatus?: 'success' | 'none';
  totalNumberOfFiles: number;
};

const FromDeviceView = ({
  buttonName,
  onPress,
  title,
  subTitle,
  filePath,
  onPressClose,
  shouldShowUserCloudID,
  cloudRecoveryStatus,
  totalNumberOfFiles,
}: Props) => {
  const { Layout, Fonts, Gutters, Colors, Images } = useTheme();

  return (
    <View style={[style(Gutters, Layout, Colors).contains]}>
      <Text style={[Fonts.textSmallMediumExtraBold]}>{title}</Text>
      {subTitle && (
        <Text
          style={[
            Fonts.textOpacitySmallRegular,
            style(Gutters, Layout, Colors).subTitleText,
          ]}
        >
          {subTitle}
        </Text>
      )}

      {shouldShowUserCloudID && (
        <>
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
          <TitleDescriptionView
            title={t('onBoarding:cloud_recovery')}
            rightIconPath={
              cloudRecoveryStatus === 'success' ? Images.ic_green_tick : null
            }
          />
        </>
      )}

      {filePath?.length > 0 && (
        <>
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
          {filePath?.map((item, index) => (
            <View key={index}>
              <View style={[style(Gutters, Layout, Colors).fileUrlView]}>
                <FilePath
                  filePath={item?.name}
                  onPressClose={() => onPressClose && onPressClose(index)}
                  iconPath={
                    item?.fileStatus === 'success'
                      ? Images.ic_green_tick
                      : Images.ic_close_gray
                  }
                />
              </View>
              {item?.isError && (
                <ErrorView
                  iconPath={Images.ic_error_tick}
                  text={t('onBoarding:incorrect_file')}
                  textColor={Colors.textError}
                />
              )}
            </View>
          ))}
        </>
      )}

      {(shouldShowUserCloudID && cloudRecoveryStatus === 'success') ||
      (filePath?.length &&
        filePath?.filter(item => item.fileStatus === 'success').length ===
          filePath?.length &&
        filePath?.filter(item => item.fileStatus === 'success').length ===
          totalNumberOfFiles) ? null : (
        <>
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
          <Button text={buttonName} onPress={onPress} />
        </>
      )}
    </View>
  );
};

FromDeviceView.defaultProps = {
  filePath: '',
  onPressClose: '',
  shouldShowUserCloudID: false,
  shouldShowError: false,
  subTitle: '',
  cloudRecoveryStatus: 'none',
};

export default FromDeviceView;
