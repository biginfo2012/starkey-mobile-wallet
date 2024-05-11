import { fonts, gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Fonts: typeof fonts,
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
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    textImage: {
      width: 40,
      height: 40,
      backgroundColor: Colors?.white,
      ...Layout.center,
      borderRadius: 20,
    },
    text: { ...Fonts.textLarge },
  });
};
