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
    secretAddressToggleAndInfoView: {
      ...Layout.rowCenter,
      ...Layout.justifyContentBetween,
      backgroundColor: Colors.inputBackground,
      ...Gutters.tinyVPadding,
      ...Gutters.smallHPadding,
      ...BorderRadius.MediumBorderRadius,
    },
    secretAddressInfoText: {
      ...Gutters.smallHMargin,
    },
  });
};
