import { gutters, layout } from 'theme';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
) => {
  const topAbsolute = {
    ...Layout.absolute,
    top: 0,
  };

  const bottomAbsolute = {
    ...Layout.absolute,
    bottom: 0,
  };

  return getStyleSheet().create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      ...Layout.absoluteFill,
    },
    finder: {
      ...Layout.center,
    },
    topLeftEdge: {
      ...topAbsolute,
      left: 0,
    },
    topRightEdge: {
      ...topAbsolute,
      right: 0,
    },
    bottomLeftEdge: {
      ...bottomAbsolute,
      left: 0,
    },
    bottomRightEdge: {
      ...bottomAbsolute,
      right: 0,
    },
    animatedLine: {
      height: 2,
      width: '95%',
      backgroundColor: Colors.primary,
    },
    addressBook: {
      ...Gutters.tinyMediumPadding,
      backgroundColor: applyOpacityToHexColor(Colors.background, 0.8),
      borderWidth: 0,
    },
    addressBookText: {
      color: Colors.white,
    },
  });
};
