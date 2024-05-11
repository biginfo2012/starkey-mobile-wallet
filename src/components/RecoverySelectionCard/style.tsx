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
      backgroundColor: Colors.inputBackground,
      ...Gutters.regularPadding,
      ...BorderRadius.LargeBorderRadius,
      ...Layout.row,
      ...Layout.justifyContentBetween,
    },
    leftView: {
      ...Layout.fillShrink,
    },
    rightView: {},
    titleAndTagWrapper: {
      ...Layout.row,
    },
    rightViewImage: {
      height: 64,
      width: 64,
      borderRadius: 20,
      overflow: 'hidden',
    },
  });
};
