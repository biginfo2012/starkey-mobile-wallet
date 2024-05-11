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
      ...Gutters.tinyHPadding,
    },
    flatList: {
      ...Layout.fillShrink,
    },
    flatListItem: {
      ...Layout.rowCenter,
      ...Gutters.smallVPadding,
      backgroundColor: Colors.blackGray,
      ...Gutters.tinyHPadding,
      borderWidth: 1,
      borderColor: Colors.blackGray,
    },
    itemText: { ...Layout.fill, ...Gutters.smallLMargin },
    itemLeftImage: { width: 30, height: 30 },
    headerSectionText: {
      ...Gutters.smallLMargin,
      ...Fonts.textOpacitySmall,
      ...Gutters.extraTinyBMargin,
    },
    titleText: {
      ...Fonts.textRegularBold,
      ...Layout.fill,
      ...Layout.textAlignCenter,
    },
  });
};
