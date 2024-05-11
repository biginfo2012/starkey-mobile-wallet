import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors?: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    menuBtn: {
      ...Gutters.tinyMediumRMargin,
      width: 24,
      height: 24,
    },
    viewItem: {
      ...Layout.rowHCenter,
      ...Gutters.smallHPadding,
      ...Gutters.tinyVPadding,
    },
    viewItemWithBorder: {
      ...Layout.rowHCenter,
      ...Gutters.smallHPadding,
      ...Gutters.tinyVPadding,
      borderBottomColor: applyOpacityToHexColor(Colors?.border, 0.3),
      borderBottomWidth: 1,
    },
    menuView: {
      ...BorderRadius.RegularBorderRadius,
      backgroundColor: Colors?.white,
    },
    eyeIcon: {
      width: 20,
      height: 20,
      tintColor: Colors?.inputBackground,
      ...Gutters.tinyLMargin,
    },
  });
};
