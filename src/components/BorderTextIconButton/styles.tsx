import { gutters, layout } from 'theme';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  pressed: boolean,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    button: {
      ...Gutters.extraTinyPadding,
      backgroundColor: pressed ? Colors.transparent : Colors.transparent,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: applyOpacityToHexColor(Colors.textGray600, 0.3),
      ...Layout.rowCenter,
    },
    image: {
      height: 20,
      width: 20,
      ...Gutters.extraTinyRMargin,
    },
    rightImage: {
      height: 18,
      width: 16,
      ...Gutters.extraTinyLMargin,
    },
  });
};
