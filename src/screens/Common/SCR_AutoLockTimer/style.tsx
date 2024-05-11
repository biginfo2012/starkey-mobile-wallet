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
    descContainer: {
      ...Layout.rowHCenter,
      ...BorderRadius.MediumBorderRadius,
      ...Gutters.mediumVMargin,
      ...Gutters.smallHPadding,
      backgroundColor: Colors?.textGray800,
    },
    flatListBG: {
      ...BorderRadius.MediumBorderRadius,
      backgroundColor: Colors.inputBackground,
    },
    icon: {
      width: 22,
      height: 22,
      marginLeft: 8,
    },
  });
};
