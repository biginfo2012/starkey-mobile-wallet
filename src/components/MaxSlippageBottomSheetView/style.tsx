import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors?: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    bottomSheetBg: {
      backgroundColor: Colors?.inputBackground,
      ...BorderRadius.LargeBorderRadius,
    },
    titleText: {
      ...Layout.fill,
      ...Layout.textAlignCenter,
    },
    bottomButtonContainer: {
      ...Layout.row,
      ...Gutters.smallHMargin,
      ...Gutters.mediumVMargin,
    },
    button: {
      ...Gutters.tinySmallVPadding,
      ...Gutters.tinyMediumHPadding,
      ...BorderRadius.MediumBorderRadius,
    },
    customContainer: {
      ...Layout.fill,
      ...Layout.row,
      ...Layout.alignItemsCenter,
      ...BorderRadius.MediumBorderRadius,
      ...Gutters.tinyLMargin,
      backgroundColor: Colors?.blackGray,
    },
  });
};
