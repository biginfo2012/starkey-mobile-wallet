import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
  Gutters: typeof gutters,
) => {
  return getStyleSheet().create({
    container: {
      ...Layout.fullWidth,
      backgroundColor: Colors.inputBackground,
      ...BorderRadius.MediumBorderRadius,
      ...Gutters.smallHPadding,
      ...Gutters.smallTPadding,
      ...Gutters.smallBPadding,
    },
    wrapper: {
      ...Layout.fill,
      ...Gutters.smallHPadding,
    },
    clearAllBtn: { ...Gutters.extraTinyVPadding, ...Gutters.tinyHPadding },
  });
};
