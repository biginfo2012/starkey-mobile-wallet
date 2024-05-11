import { fonts, gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
  Fonts: typeof fonts,
) => {
  return getStyleSheet().create({
    container: {
      ...Layout.fill,
    },
    flatList: {
      ...Layout.fillShrink,
    },
    flatListItem: {
      ...Layout.rowCenter,
      ...Gutters.smallVPadding,
      backgroundColor: Colors.blackGray,
      ...Gutters.smallLPadding,
      borderWidth: 1,
      borderColor: Colors.blackGray,
    },
    itemText: { ...Layout.fill },
    itemLeftImage: { width: 30, height: 30, ...Gutters.smallRMargin },
    headerSectionText: {
      ...Gutters.smallLMargin,
      ...Fonts.textOpacitySmall,
      ...Gutters.tinyBMargin,
    },
    titleText: {
      ...Fonts.textRegularBold,
      ...Layout.fill,
      ...Layout.textAlignCenter,
    },
  });
};
