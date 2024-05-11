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
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    icon: {
      ...Gutters.tinyRMargin,
      width: 32,
      height: 32,
      ...BorderRadius.ExtraMediumBorderRadius,
    },
    textImage: {
      width: 32,
      height: 32,
      backgroundColor: Colors?.white,
      ...Layout.center,
      ...BorderRadius.ExtraMediumBorderRadius,
      ...Gutters.tinyRMargin,
    },
  });
};
