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
    flatListColWrapper: {
      ...Layout.justifyContentBetween,
      ...Gutters.smallHMargin,
    },
    flatListItem: {
      ...Gutters.smallVMargin,
      width: '33%',
    },
    flatListContentContainer: {
      backgroundColor: Colors.inputBackground,
      ...BorderRadius.ExtraMediumBorderRadius,
    },
  });
};
