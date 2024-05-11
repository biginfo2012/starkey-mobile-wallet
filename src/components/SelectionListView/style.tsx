import { fonts, gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
  Fonts: typeof fonts,
) => {
  return getStyleSheet().create({
    flatList: {
      backgroundColor: Colors.blackGray,
      ...Layout.fillShrink,
      ...BorderRadius.ExtraMediumBorderRadius,
      borderWidth: 1,
      borderColor: Colors.transparent,
    },
    flatListItem: {
      ...Layout.rowCenter,
      ...Gutters.smallVPadding,
      ...Gutters.smallLMargin,
    },
    itemText: { ...Layout.fill, ...Gutters.tinyLMargin },
    itemLeftImage: { width: 16, height: 16 },
    titleText: {
      ...Fonts.textRegularBold,
      ...Layout.fill,
      ...Layout.textAlignCenter,
    },
    itemSeparatorView: {
      height: 0.5,
      backgroundColor: applyOpacityToHexColor(Colors.border, 0.65),
      marginLeft: 45,
    },
  });
};
