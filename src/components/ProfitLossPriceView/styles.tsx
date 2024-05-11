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
    button: {
      flex: 1,
      ...BorderRadius.MediumBorderRadius,
      backgroundColor: Colors.inputBackground,
      ...Gutters.smallPadding,
    },
    icon: {
      width: 16,
      height: 16,
    },
    viewTrending: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    monkeyIconStyle: {
      width: 20,
      height: 20,
      ...Gutters.smallBMargin,
      ...Gutters.tinyTMargin,
    },
  });
};
