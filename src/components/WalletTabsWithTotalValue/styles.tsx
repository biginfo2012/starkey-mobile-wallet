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
    container: {
      width: '100%',
      ...Gutters.smallPadding,
      borderColor: applyOpacityToHexColor(Colors.textGray600, 0.3),
      ...BorderRadius.MediumBorderRadius,
      borderWidth: 1,
    },
    addressBtn: { ...Gutters.tinyPadding },
    monkeyIconStyle: {
      width: 34,
      height: 34,
      ...Gutters.tinyBMargin,
    },
  });
};
