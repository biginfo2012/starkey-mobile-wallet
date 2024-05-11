import React, { Dispatch, SetStateAction } from 'react';
import { View, Text } from 'react-native';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';

import { CustomToggleSwitch, HorizontalSeparatorView } from '..';
import { style } from './style';

type Props = {
  isEnabled: boolean;
  setIsEnabled: Dispatch<SetStateAction<boolean>>;
};

export default function SecretAddressTokenInfoView(props: Props) {
  const { isEnabled, setIsEnabled } = props;
  const { Colors, Gutters, Layout, Fonts } = useTheme();

  return (
    <>
      <View
        style={style(Gutters, Layout, Colors).secretAddressToggleAndInfoView}
      >
        <Text style={{ ...Fonts.textSmallWhiteBold }}>
          {t('common:Secret_Address')}
        </Text>
        <CustomToggleSwitch
          isEnabled={isEnabled}
          onPress={() => {
            setIsEnabled(!isEnabled);
          }}
        />
      </View>
      <HorizontalSeparatorView />
      <Text
        style={[
          { ...Fonts.textTinyDescriptionRegular },
          style(Gutters, Layout, Colors).secretAddressInfoText,
        ]}
      >
        {t('common:secretAddressInfoText')}
      </Text>
    </>
  );
}
