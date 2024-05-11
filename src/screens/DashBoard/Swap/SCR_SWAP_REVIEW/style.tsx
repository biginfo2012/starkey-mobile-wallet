import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    tokenDetailsContainer: {
      ...Gutters.smallTMargin,
    },
    tokenIcon: {
      width: 30,
      height: 30,
      ...Gutters.tinyRMargin,
    },
    swapDownIcon: {
      width: 32,
      height: 32,
      ...Gutters.tinyVMargin,
    },
    shadow: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    reviewDetailsContainer: {
      ...Gutters.tinyVPadding,
      ...Gutters.smallHPadding,
      ...BorderRadius.MediumBorderRadius,
      ...Gutters.mediumVMargin,
    },
    rowSpaceBetweenContainer: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
    },
    swapBtn: {
      width: '100%',
    },
  });
};
