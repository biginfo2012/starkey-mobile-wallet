/**
 * This file contains all application's style relative to fonts
 */
import { ThemeVariables } from '../../@types/theme';
import { applyOpacityToHexColor } from './Helper/ColorUtils';
import getStyleSheet from './Helper/currentStyleSheet';

export default function ({ FontSize, Colors, fontFamily }: ThemeVariables) {
  return getStyleSheet().create({
    textExtraTinySemiBold: {
      fontSize: FontSize.extraTiny,
      fontFamily: fontFamily.SemiBold,
    },
    textExtraTinyRegular: {
      fontSize: FontSize.extraTiny,
      fontFamily: fontFamily.Regular,
      color: Colors.white,
    },
    textTinyRegular: {
      fontSize: FontSize.tiny,
      fontFamily: fontFamily.Regular,
      color: Colors.white,
    },
    textTinyBold: {
      fontSize: FontSize.tiny,
      color: Colors.textGray400,
      fontFamily: fontFamily.Bold,
    },
    textTinyBoldWhite: {
      fontSize: FontSize.tiny,
      fontFamily: fontFamily.Bold,
      color: Colors.white,
    },
    textTinyDescriptionBold: {
      fontSize: FontSize.tiny,
      color: applyOpacityToHexColor(Colors.textGray600, 0.6),
      fontFamily: fontFamily.Bold,
    },
    textTinyDescriptionLightRegular: {
      fontSize: FontSize.tiny,
      color: applyOpacityToHexColor(Colors.textGray600, 0.3),
      fontFamily: fontFamily.Regular,
    },
    textTinyDescriptionRegular: {
      fontSize: FontSize.tiny,
      color: applyOpacityToHexColor(Colors.textGray600, 0.6),
      fontFamily: fontFamily.Regular,
    },
    textTinyGrayLightRegular: {
      fontSize: FontSize.tiny,
      fontFamily: fontFamily.Regular,
      color: Colors.grayText,
    },
    textSmallBoldWhite: {
      fontSize: FontSize.small,
      fontFamily: fontFamily.Bold,
      color: Colors.white,
    },
    textSmallDescriptionBold: {
      fontSize: FontSize.small,
      color: applyOpacityToHexColor(Colors.textGray600, 0.6),
      fontFamily: fontFamily.Bold,
    },
    textSmallDescriptionRegular: {
      fontSize: FontSize.small,
      color: applyOpacityToHexColor(Colors.textGray600, 0.6),
      fontFamily: fontFamily.Regular,
    },
    textSmallBold: {
      fontSize: FontSize.small,
      color: Colors.white,
      fontFamily: fontFamily.Bold,
    },
    textSmallMediumExtraBold: {
      fontSize: FontSize.smallMedium,
      color: Colors.white,
      fontFamily: fontFamily.ExtraBold,
    },
    textSmallRegular: {
      fontSize: FontSize.small,
      color: Colors.white,
      fontFamily: fontFamily.Regular,
    },
    textSmall: {
      fontSize: FontSize.small,
      color: Colors.textGray400,
    },
    textSmallWhiteBold: {
      fontSize: FontSize.small,
      color: Colors.textWhite,
      fontFamily: fontFamily.Bold,
    },
    textSmallTinyGrayOpacityRegular: {
      fontSize: FontSize.smallTiny,
      color: Colors.textGray600,
      opacity: 0.6,
      fontFamily: fontFamily.Regular,
    },
    textSmallTinyGrayOpacityBold: {
      fontSize: FontSize.smallTiny,
      color: Colors.textGray600,
      opacity: 0.6,
      fontFamily: fontFamily.Bold,
    },
    textSmallTinyWhiteMedium: {
      fontSize: FontSize.smallTiny,
      fontFamily: fontFamily.Medium,
      color: Colors.white,
    },
    textSmallTinyWhiteBold: {
      fontSize: FontSize.smallTiny,
      fontFamily: fontFamily.Bold,
      color: Colors.white,
    },
    textRegular: {
      fontSize: FontSize.regular,
      color: Colors.textWhite,
      fontFamily: fontFamily.Regular,
    },
    textRegularBold: {
      fontSize: FontSize.regular,
      color: Colors.textWhite,
      fontFamily: fontFamily.Bold,
    },
    textRegularBlack: {
      fontSize: FontSize.regular,
      fontFamily: fontFamily.Regular,
      color: Colors.inputBackground,
    },
    textMediumRegular: {
      fontSize: FontSize.regular,
      color: Colors.white,
      fontFamily: fontFamily.Regular,
    },
    textLarge: {
      fontSize: FontSize.large,
      color: Colors.textWhite,
      fontFamily: fontFamily.ExtraBold,
    },
    textLargeRegular: {
      fontSize: FontSize.large,
      color: Colors.textWhite,
      fontFamily: fontFamily.Regular,
    },
    textOpacityRegular: {
      fontSize: FontSize.regular,
      color: Colors.textGray600,
      opacity: 0.6,
      fontFamily: fontFamily.Regular,
    },
    textOpacitySmallRegular: {
      fontSize: FontSize.regular,
      color: Colors.textGray600,
      opacity: 0.6,
      fontFamily: fontFamily.Regular,
    },
    textOpacityRegularBold: {
      fontSize: FontSize.regular,
      color: applyOpacityToHexColor(Colors.textGray600, 0.6),
      fontFamily: fontFamily.Bold,
    },
    text30OpacityRegular: {
      fontSize: FontSize.regular,
      color: Colors.textGray600,
      opacity: 0.3,
      fontFamily: fontFamily.Regular,
    },
    textOpacitySmall: {
      fontSize: FontSize.small,
      color: Colors.textGray600,
      opacity: 0.6,
      fontFamily: fontFamily.Regular,
    },
    textCount: {
      fontSize: FontSize.tiny,
      color: Colors.textGray600,
      fontFamily: fontFamily.Regular,
    },
    titleSmall: {
      fontSize: FontSize.small,
      color: Colors.white,
      fontFamily: fontFamily.Bold,
    },
    titleLarge: {
      fontSize: FontSize.large,
      fontFamily: fontFamily.ExtraBold,
      color: Colors.textWhite,
    },
    titleExtraLarge: {
      fontSize: FontSize.extraLarge,
      fontFamily: fontFamily.Bold,
      color: Colors.textWhite,
    },
    titleMedium: {
      fontSize: FontSize.medium,
      fontFamily: fontFamily.ExtraBold,
      color: Colors.textWhite,
    },
    titleMediumMediumExtraBold: {
      fontSize: FontSize.mediumMedium,
      color: Colors.white,
      fontFamily: fontFamily.ExtraBold,
    },
    textErrorTinyBold: {
      fontSize: FontSize.tiny,
      fontFamily: fontFamily.Bold,
      color: Colors.textError,
    },
    textErrorRegularBold: {
      fontSize: FontSize.regular,
      fontFamily: fontFamily.Bold,
      color: Colors.textError,
    },
    textSuccessRegularBold: {
      fontSize: FontSize.regular,
      fontFamily: fontFamily.Bold,
      color: Colors.textSuccess,
    },
    textBold: {
      fontWeight: 'bold',
    },
    textUppercase: {
      textTransform: 'uppercase',
    },
    textCenter: {
      textAlign: 'center',
    },
    textVHCenter: {
      textAlignVertical: 'center',
      textAlign: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
    textLobster: {
      fontFamily: 'lobster',
      fontWeight: 'normal',
    },
  });
}
