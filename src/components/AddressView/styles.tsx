import { gutters, layout } from 'theme';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    button: {
      ...Gutters.tinyMediumHPadding,
      ...Gutters.tinyVPadding,
      backgroundColor: Colors.transparent,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: applyOpacityToHexColor(Colors.textGray600, 0.3),
      ...Layout.rowCenter,
    },
    rightImage: {
      height: 14,
      width: 16,
      ...Gutters.extraTinyLMargin,
    },
  });
};
