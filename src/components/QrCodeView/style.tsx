import { gutters } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      ...Gutters.regularPadding,
      backgroundColor: Colors.white,
      ...BorderRadius.MediumBorderRadius,
    },
  });
};
