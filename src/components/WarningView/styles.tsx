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
    errorImage: {
      height: 32,
      width: 32,
    },
    container: { ...Layout.row },
    textsWrapper: { ...Layout.fill },
    textItem: {
      ...Layout.row,
      ...Gutters.extraTinyBMargin,
      ...Gutters.tinyRMargin,
    },
    warningTextContainer: {
      borderColor: Colors.border,
      borderWidth: 1,
      padding: 16,
      ...BorderRadius.MediumBorderRadius,
    },
    warningGradientTextContainer: {
      height: 28,
    },
  });
};
