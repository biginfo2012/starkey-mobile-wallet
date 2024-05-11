import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors?: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      ...Gutters.extraTinyVMargin,
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    subView: {
      ...Layout.fill,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Gutters.tinyLMargin,
      ...Gutters.tinyVMargin,
    },
    icon: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    textImage: {
      width: 30,
      height: 30,
      backgroundColor: Colors?.white,
      ...Layout.center,
      borderRadius: 15,
    },
    row: {
      ...Layout.row,
    },
    starIcon: {
      width: 16,
      height: 16,
      ...Gutters.tinyLMargin,
    },
    viewAmount: {
      ...Layout.alignItemsEnd,
      ...Layout.justifyContentCenter,
      ...Gutters.tinyLMargin,
    },
  });
};
