import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
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
      ...BorderRadius.LargeBorderRadius,
      ...Layout.center,
      ...Gutters.regularPadding,
    },
    icon: {
      width: 70,
      height: 70,
      ...Gutters.smallBMargin,
      borderRadius: 35,
    },
    imgStyle: {
      width: 160,
      height: 160,
      ...Gutters.regularTMargin,
      overflow: 'hidden',
    },
    btnOk: {
      width: '100%',
    },
    btnCancel: {
      ...Gutters.smallTMargin,
    },
    viewGasPrice: {
      backgroundColor: applyOpacityToHexColor(Colors.buttonBorderColor, 0.1),
      ...BorderRadius.MediumBorderRadius,
      ...Layout.fullWidth,
      ...Gutters.smallHPadding,
      ...Gutters.extraTinyVPadding,
    },

    textImage: {
      width: 70,
      height: 70,
      backgroundColor: Colors?.white,
      ...Layout.center,
      borderRadius: 35,
      ...Gutters.smallBMargin,
    },
  });
};
