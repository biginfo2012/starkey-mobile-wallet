import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
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
    bottomView: {
      ...Layout.justifyContentEnd,
      ...Gutters.tinySmallPadding,
    },
    bottomButtonStyle: {
      ...BorderRadius.MediumBorderRadius,
      ...Gutters.tinySmallBMargin,
    },
    sectionHeader: {
      height: Variables.MetricsSizes.medium,
    },
    rawRootContainer: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.alignItemsCenter,
      ...Gutters.tinyMediumVPadding,
      ...Gutters.smallHPadding,
      ...Gutters.smallHMargin,
      backgroundColor: Colors?.inputBackground,
      borderTopLeftRadius: index === 0 ? 14 : 0, // for first item left
      borderTopRightRadius: index === 0 ? 14 : 0, // for first item right
      borderBottomLeftRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item left
      borderBottomRightRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item right
    },
    rawItemStyle: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.alignItemsCenter,
    },
    rightTextStyle: {
      ...Gutters.tinyMediumRMargin,
    },
    toogleContainer: {
      ...Layout.fill,
    },
  });
};
