import { gutters } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    viewCenter: {
      ...Gutters.tinySmallPadding,
      backgroundColor: applyOpacityToHexColor(Colors.inputBackground, 0.5),
      ...BorderRadius.MediumBorderRadius,
    },
  });
};
