import { layout } from 'theme';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    containerStyle: {
      height: 5,
      ...Layout.fullWidth,
      borderRadius: 5,
    },
    trackStyle: {
      borderRadius: 5,
      height: 5,
      backgroundColor: applyOpacityToHexColor(Colors.switchBGColor, 0.6),
      width: '100%',
    },
    markerStyle: {
      backgroundColor: Colors.textPurple,
      borderRadius: 9,
      height: 18,
      width: 18,
      borderWidth: 0,
      top: 2,
    },
  });
};
