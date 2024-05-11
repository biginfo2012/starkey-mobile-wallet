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
      ...Layout.fill,
      backgroundColor: 'white',
    },
    wrapper: {
      ...Layout.fill,
      ...Gutters.smallHPadding,
      ...Layout.alignItemsCenter,
    },
    subView: {
      ...Layout.fill,
      ...Gutters.tinySmallPadding,
      ...Layout.alignItemsCenter,
    },
    bottomSheetBg: {
      backgroundColor: Colors.background,
      ...BorderRadius.LargeBorderRadius,
    },
    bottomButton: {
      ...Layout.absolute,
      ...Layout.bottom0,
      ...Gutters.tinyVPadding,
      ...Gutters.smallBMargin,
      borderWidth: 0,
      backgroundColor: Colors.primary,
    },
    bottomBorderButton: {
      ...Layout.absolute,
      ...Layout.bottom0,
      ...Gutters.tinyVPadding,
      ...Gutters.smallBMargin,
      ...BorderRadius.LargeBorderRadius,
      backgroundColor: applyOpacityToHexColor(Colors.bottomButtonBG, 0.3),
      borderWidth: 0,
    },
    viewAmount: {
      ...Layout.alignItemsCenter,
      ...Layout.fill,
      ...Gutters.smallTMargin,
    },
    btnTextWithWhiteColor: { color: Colors.white },
    btnTextWithPurpleColor: { color: Colors.textPurple },
  });
};
