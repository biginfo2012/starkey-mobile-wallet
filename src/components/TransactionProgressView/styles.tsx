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
      ...Layout.row,
      backgroundColor: Colors.inputBackground,
      ...BorderRadius.MediumBorderRadius,
      ...Layout.center,
    },
    textView: {
      ...Layout.fill,
    },
    iconInfo: {
      width: 20,
      height: 20,
      ...Gutters.tinySmallMargin,
    },
    iconProgress: {
      width: 60,
      height: 60,
    },
  });
};
