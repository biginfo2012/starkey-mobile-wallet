import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      ...BorderRadius.LargeBorderRadius,
      overflow: 'hidden',
      backgroundColor: Colors.inputBackground,
    },
    alertBtn: { ...Gutters.tinyVPadding },
    subContainer: {
      ...BorderRadius.LargeBorderRadius,
      overflow: 'hidden',
      ...Gutters.regularHPadding,
      ...Gutters.regularVPadding,
    },
    viewToken: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
      ...Layout.justifyContentBetween,
    },
    tokenIcon: {
      ...Gutters.tinyRMargin,
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    monkeyIconStyle: { width: 22, height: 22, ...Gutters.tinyBMargin },
    menuBtn: {
      ...Layout.alignItemsCenter,
      width: 24,
      height: 24,
    },
    menuStarBtn: {
      ...Gutters.tinyLMargin,
    },
    menuRow: { ...Layout.row },
    menuIcon: { width: 18, height: 24 },
    gasIcon: { ...Gutters.tinyRMargin, width: 24, height: 24 },
    viewAction: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Gutters.regularPadding,
    },
    textImage: {
      width: 40,
      height: 40,
      backgroundColor: Colors.white,
      ...Layout.center,
      borderRadius: 20,
      ...Gutters.tinyRMargin,
    },
    menuView: {
      ...BorderRadius.RegularBorderRadius,
      backgroundColor: Colors?.white,
    },
  });
};
