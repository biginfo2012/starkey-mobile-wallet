import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      ...Gutters.tinySmallPadding,
      ...Layout.row,
      backgroundColor: Colors.inputBackground,
      ...BorderRadius.MediumBorderRadius,
      ...Layout.center,
    },
    icon: {
      ...Gutters.extraTinyRMargin,
      width: 18,
      height: 18,
    },
    rightIconStyle: {
      width: 24,
      height: 24,
    },
  });
};
