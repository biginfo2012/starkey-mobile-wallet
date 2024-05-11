import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      ...Gutters.tinySmallHPadding,
      ...Gutters.tinyVPadding,
      ...BorderRadius.MediumBorderRadius,
      borderWidth: 1,
      borderColor: applyOpacityToHexColor(Colors.textGray600, 0.3),
      ...Layout.fullWidth,
      ...Layout.alignItemsCenter,
    },
  });
};
