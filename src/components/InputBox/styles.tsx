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
      ...BorderRadius.MediumBorderRadius,
      borderWidth: 1,
      borderColor: Colors.inputBackground,
      ...Layout.center,
    },
    icon: {
      width: 18,
      height: 18,
    },
  });
};
