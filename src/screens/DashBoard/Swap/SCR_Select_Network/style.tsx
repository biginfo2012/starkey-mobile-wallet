import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
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
    headerRightImage: { ...BorderRadius.ExtraMediumBorderRadius },
    flatListContainer: {
      ...Layout.fill,
      ...Gutters.mediumVMargin,
    },
    sectionTitleContainer: {
      ...Gutters.mediumTMargin,
      ...Gutters.tinyBMargin,
      ...Gutters.smallLMargin,
    },
    itemContainer: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
      ...Gutters.smallLPadding,
      ...Gutters.tinyVPadding,
      backgroundColor: Colors?.inputBackground,
      borderTopLeftRadius: index === 0 ? 14 : 0, // for first item left
      borderTopRightRadius: index === 0 ? 14 : 0, // for first item right
      borderBottomLeftRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item left
      borderBottomRightRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item right
    },
    icon: {
      width: 30,
      height: 30,
    },
    subView: {
      ...Layout.fill,
      ...Gutters.tinyMargin,
    },
  });
};
