import { layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    viewTextStyle: {
      ...Layout.center,
      ...Layout.fullSize,
      backgroundColor: Colors.background,
      ...Layout.absolute,
      bottom: 0,
    },
  });
};
