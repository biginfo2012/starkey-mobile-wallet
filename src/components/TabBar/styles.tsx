import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
  Gutters?: typeof gutters,
) => {
  return getStyleSheet().create({
    tabBarRootContainer: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...BorderRadius.ExtraMediumBorderRadius,
      height: Variables.MetricsSizes.medium,
      ...Gutters?.tooExtraTinyPadding,
      backgroundColor: applyOpacityToHexColor(Colors.bottomButtonBG, 0.3),
    },
    tab: {
      ...Layout.fill,
      ...Layout.justifyContentCenter,
      ...Layout.alignItemsCenter,
      borderRadius: 20,
    },
  });
};
