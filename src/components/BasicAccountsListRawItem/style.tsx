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
    rawRootContainer: {
      ...Gutters.smallLPadding,
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    subView: {
      ...Layout.fill,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Gutters.tinyLMargin,
      ...Gutters.smallVMargin,
    },
    titleContainer: {
      ...Layout.fill,
      ...Layout.rowHCenter,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors?.textPurple,
      ...Gutters.extraTinyHMargin,
    },
    icon: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    menuIcon: {
      width: 20,
      height: 22,
    },
    checkBox: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    textImage: {
      width: 30,
      height: 30,
      backgroundColor: Colors?.white,
      ...Layout.center,
      borderRadius: 15,
    },
    menuBtn: {
      ...Gutters.tinyMediumRMargin,
      width: 24,
      height: 24,
    },
    menuView: {
      ...BorderRadius.RegularBorderRadius,
      backgroundColor: Colors?.white,
    },
  });
};
