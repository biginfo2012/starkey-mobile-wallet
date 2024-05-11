import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors?: typeof Variables.Colors,
  index?: number,
  length?: number,
) => {
  return getStyleSheet().create({
    headerRightImage: { width: 24, height: 22 },
    rowRootContainer: {
      ...Layout.row,
      ...Gutters.tinyMediumVPadding,
      ...Gutters.tinyMediumVPadding,
      ...Gutters.smallHPadding,
      backgroundColor: Colors?.textGray800,
      borderTopLeftRadius: index === 0 ? 14 : 0, // for first item left
      borderTopRightRadius: index === 0 ? 14 : 0, // for first item right
      borderBottomLeftRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item left
      borderBottomRightRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item right
    },
    noDataContainer: {
      backgroundColor: applyOpacityToHexColor(Colors?.inputBackground, 0.4),
      ...BorderRadius.MediumBorderRadius,
      ...Layout.fill,
      ...Gutters.smallBMargin,
    },
  });
};
