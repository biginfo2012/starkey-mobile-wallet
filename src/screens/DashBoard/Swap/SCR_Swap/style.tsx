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
    container: {
      ...Layout.fill,
      ...BorderRadius.LargeBorderRadius,
      ...Gutters.smallTMargin,
      ...Gutters.mediumHPadding,
      ...Gutters.mediumTPadding,
      backgroundColor: Colors?.background,
    },
    selectNetworkContainer: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.alignItemsCenter,
      ...Gutters.tinyMediumVPadding,
      ...Gutters.smallHPadding,
      ...BorderRadius.MediumBorderRadius,
      ...Gutters.mediumVMargin,
      backgroundColor: Colors?.inputBackground,
    },
    textWithNextArrowContainer: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    nextArrowIcon: { width: 8, height: 12, ...Gutters.tinyMediumLMargin },
    enterSwapTokenAmountContainer: {
      ...BorderRadius.MediumBorderRadius,
      ...Gutters.smallHPadding,
      ...Gutters.tinyMediumVPadding,
      backgroundColor: Colors?.inputBackground,
      borderWidth: 1,
      borderColor: Colors?.inputBackground,
    },
    swappedIcon: {
      width: 32,
      height: 32,
      alignSelf: 'center',
      marginVertical: -12,
      zIndex: 10,
    },
    rowSpaceBetweenContainer: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
    },
    inputContainer: {
      ...Gutters.smallRMargin,
      ...Layout.fill,
    },
    textWithIconContainer: {
      ...BorderRadius.LargeBorderRadius,
      ...Gutters.tinyHPadding,
    },
    tokenIcon: {
      width: 20,
      height: 20,
    },
    nextIcon: {
      width: 10,
      height: 14,
      ...Gutters.extraTinyLMargin,
      tintColor: Colors?.textPurple,
      transform: [{ rotateY: '180deg' }],
    },
    tankIcon: {
      width: 18,
      height: 20,
    },
    dropIcon: {
      width: 20,
      height: 20,
    },
    borderContainer: {
      borderWidth: 1,
      ...Gutters.tinyVPadding,
      ...Gutters.smallHPadding,
      ...BorderRadius.MediumBorderRadius,
      ...Gutters.mediumVMargin,
    },
    editIcon: {
      width: 22,
      height: 22,
      ...Gutters.extraTinyLMargin,
    },
    reviewBtn: {
      width: '100%',
    },
  });
};
