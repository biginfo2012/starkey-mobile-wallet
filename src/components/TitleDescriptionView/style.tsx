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
      ...Layout.row,
      backgroundColor: Colors.blackGray,
      ...BorderRadius.MediumBorderRadius,
      ...Layout.alignItemsCenter,
      ...Gutters.smallPadding,
    },
    textView: {
      ...Layout.fill,
    },
    icon: {
      width: 20,
      height: 20,
      ...Gutters.tinyLMargin,
    },
    textInputContainer: {
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
    },
    textInput: {
      ...Layout.fill,
      paddingVertical: 0,
    },
  });
};
