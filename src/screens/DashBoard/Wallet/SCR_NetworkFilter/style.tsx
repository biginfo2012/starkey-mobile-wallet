import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors?: typeof Variables.Colors,
  index?: number,
  length?: number,
) => {
  return getStyleSheet().create({
    container: {
      backgroundColor: Colors?.inputBackground,
    },
    headerRightImage: { width: 24, height: 22 },
    searchBoxContainer: {
      ...Gutters.mediumTMargin,
      ...Gutters.smallBMargin,
    },
    flatListContainer: {
      ...Layout.fill,
      ...Gutters.tinyTMargin,
    },
    itemContainer: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
      ...Gutters.smallLPadding,
      ...Gutters.tinyVPadding,
      backgroundColor: Colors?.blackGray,
      borderTopLeftRadius: index === 0 ? 14 : 0, // for first item left
      borderTopRightRadius: index === 0 ? 14 : 0, // for first item right
      borderBottomLeftRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item left
      borderBottomRightRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item right
    },
    bottomView: {
      ...Gutters.smallTMargin,
      ...Gutters.mediumBMargin,
    },
  });
};
