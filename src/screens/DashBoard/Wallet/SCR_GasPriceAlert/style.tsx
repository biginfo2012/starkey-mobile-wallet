import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors?: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      backgroundColor: Colors?.inputBackground,
    },
    inputRawContainer: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    txtStyle: {
      ...Gutters.regularHMargin,
    },
    flex05: { flex: 0.5 },
  });
};
