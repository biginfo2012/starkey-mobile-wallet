import { gutters, layout, fonts } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
  Fonts: typeof fonts,
) => {
  return getStyleSheet().create({
    topView: {
      ...Gutters.smallVMargin,
    },
    warningViewImage: { height: 24, width: 24 },
    warningText: {
      ...Fonts.textTinyBoldWhite,
    },
    warningViewContainer: {
      ...Gutters.tinyLMargin,
    },
    secretAddressToggleAndInfoView: {
      ...Layout.rowCenter,
      ...Layout.justifyContentBetween,
      backgroundColor: Colors.inputBackground,
      ...Gutters.tinyVPadding,
      ...Gutters.smallHPadding,
      ...BorderRadius.MediumBorderRadius,
    },
    secretAddressInfoText: {
      ...Gutters.tinyHMargin,
    },
  });
};
