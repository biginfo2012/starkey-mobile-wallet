import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors?: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    flatListContainer: {
      ...Layout.fill,
    },
    itemContainer: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    icon: {
      width: 30,
      height: 30,
      borderWidth: 1,
      borderColor: Colors?.background,
      borderRadius: 15,
    },
    iconMarginLeft: {
      marginLeft: -15,
    },
    subView: {
      ...Layout.fill,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Gutters.tinyMargin,
    },
  });
};
