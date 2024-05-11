import React from 'react';
import { View, Image, Text } from 'react-native';

import { t } from 'i18next';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  height?: number | string;
  width?: number | string;
};

const Brand = ({ height, width }: Props) => {
  const { Layout, Images, Fonts, Gutters, Colors } = useTheme();

  return (
    <View style={[Layout.colCenter, style(Gutters).rootContainer]}>
      <Image
        style={[Layout.fullSize, { height, width }]}
        source={Images.ic_appLogo}
      />
      <Text style={[Fonts.titleSmall, Fonts.textCenter]}>
        {t('onBoarding:welcome_title')}
      </Text>
      <Image
        style={style(Gutters).appNameImg}
        source={Images.ic_app_name}
        resizeMode="contain"
      />
      <Text
        style={[
          Fonts.textRegularBold,
          Fonts.textCenter,
          { color: applyOpacityToHexColor(Colors.textGray600, 0.6) },
        ]}
      >
        {t('onBoarding:welcome_description')}
      </Text>
    </View>
  );
};

Brand.defaultProps = {
  height: 200,
  width: 200,
};

export default Brand;
