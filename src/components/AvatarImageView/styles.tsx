import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Layout: typeof layout,
  Gutters: typeof gutters,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      ...BorderRadius.MediumBorderRadius,
      ...Layout.fill,
      ...Gutters.tinyMargin,
      ...Layout.center,
    },

    imageBgStyle: {
      ...BorderRadius.MediumBorderRadius,
      overflow: 'hidden',
      ...Layout.fullSize,
      ...Layout.justifyContentCenter,
    },
    viewBg: {
      backgroundColor: Colors.blackGray,
      ...Layout.fill,
      opacity: 0.5,
      ...Layout.fullSize,
      ...Layout.absolute,
    },
    rightIcon: {
      width: 29,
      height: 29,
      position: 'absolute',
      top: 10,
      right: 10,
    },
  });
};
