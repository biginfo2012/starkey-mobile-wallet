import { gutters } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      ...Gutters.smallRegularPadding,
      backgroundColor: Colors.white,
    },
  });
};
