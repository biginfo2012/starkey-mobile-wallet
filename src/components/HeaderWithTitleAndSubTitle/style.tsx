import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (
  Layout: typeof layout,
  Gutters: typeof gutters,
  insetBottom: number,
  onPressNext?: any,
) => {
  return getStyleSheet().create({
    container: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...(insetBottom === 0 && Gutters.tinyTMargin),
    },
    smallTitleContainer: {
      ...Layout.fill,
      ...Layout.rowCenter,
      ...(onPressNext ? Gutters.tinyRMargin : Gutters.semiLargeRMargin),
    },
    icon: {
      ...Gutters.smallBMargin,
      width: 18,
      height: 24,
    },
    cancelText: {
      ...Gutters.smallBPadding,
    },
  });
};
