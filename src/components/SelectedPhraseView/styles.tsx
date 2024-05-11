import { layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      ...Layout.row,
      ...Layout.justifyContentCenter,
      paddingVertical: 14,
      paddingHorizontal: 8,
      ...BorderRadius.MediumBorderRadius,
      backgroundColor: Colors.inputBackground,
      borderWidth: 1,
    },
  });
};
