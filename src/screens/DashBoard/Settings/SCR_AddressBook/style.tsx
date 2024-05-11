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
    itemContainer: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
      ...Gutters.smallHPadding,
      ...Gutters.tinyVPadding,
      backgroundColor: Colors?.inputBackground,
      borderTopLeftRadius: index === 0 ? 14 : 0, // for first item left
      borderTopRightRadius: index === 0 ? 14 : 0, // for first item right
      borderBottomLeftRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item left
      borderBottomRightRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item right
    },
    icon: {
      width: 30,
      height: 30,
    },
    subView: {
      ...Layout.fill,
      ...Gutters.tinyMargin,
    },
    addressContainer: {
      borderWidth: 1,
      borderColor: applyOpacityToHexColor(Colors?.buttonBorderColor, 0.3),
      borderRadius: 22,
      ...Gutters.tinyMediumHPadding,
      ...Gutters.tinyVPadding,
    },
    sectionTitleContainer: {
      ...Gutters.smallTMargin,
      ...Gutters.tinyBMargin,
      ...Gutters.smallLMargin,
    },
    deleteRootContainer: {
      ...Layout.justifyContentCenter,
      ...Layout.alignItemsEnd,
    },
    deleteContainer: {
      backgroundColor: Colors?.bgError,
      ...Gutters.smallPadding,
    },
    deleteIcon: {
      width: 24,
      height: 24,
    },
    noDataContainer: {
      backgroundColor: applyOpacityToHexColor(Colors?.inputBackground, 0.4),
      ...BorderRadius.MediumBorderRadius,
      ...Layout.fill,
      ...Gutters.smallVMargin,
    },
    closeIconStyle: {
      width: 18,
      height: 18,
    },
  });
};
