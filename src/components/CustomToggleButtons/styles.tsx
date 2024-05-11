import { layout } from 'theme';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      width: 160,
      height: 40,
      borderRadius: 20,
      ...Layout.center,
      backgroundColor: applyOpacityToHexColor(Colors.placeholderColor, 0.3),
      ...Layout.row,
      ...Layout.justifyContentBetween,
    },
    toggle: {
      ...Layout.fill,
      height: 40,
      borderRadius: 20,
      ...Layout.center,
    },
    toggleSelected: {
      ...Layout.fill,
      height: 40,
      borderRadius: 20,
      ...Layout.center,
      backgroundColor: Colors.white,
    },
    containerImage: {
      width: 80,
      height: 40,
      borderRadius: 20,
      ...Layout.center,
      backgroundColor: applyOpacityToHexColor(Colors.placeholderColor, 0.3),
      ...Layout.row,
      ...Layout.justifyContentBetween,
    },
    icon: {
      width: 20,
      height: 20,
    },
  });
};
