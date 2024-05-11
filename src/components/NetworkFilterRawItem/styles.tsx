import { gutters, layout } from 'theme';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors?: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    icon: {
      width: 30,
      height: 30,
    },
    subView: {
      ...Layout.fill,
      ...Gutters.tinyMargin,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.alignItemsCenter,
    },
    addressContainer: {
      borderWidth: 1,
      borderColor: applyOpacityToHexColor(Colors?.buttonBorderColor, 0.3),
      borderRadius: 22,
      ...Gutters.tinyMediumHPadding,
      ...Gutters.tinyVPadding,
    },
    textImage: {
      width: 30,
      height: 30,
      backgroundColor: Colors?.white,
      ...Layout.center,
      borderRadius: 15,
    },
  });
};
