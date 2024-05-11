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
    contains: {
      ...Layout.fullWidth,
      ...BorderRadius.LargeBorderRadius,
      backgroundColor: Colors.inputBackground,
      ...Gutters.regularPadding,
    },
    icon: {
      width: 20,
      height: 20,
    },
    fileUrlView: {
      backgroundColor: Colors.blackGray,
      ...Gutters.tinyVPadding,
      ...Gutters.smallHPadding,
      ...BorderRadius.MediumBorderRadius,
      ...Gutters.tinyTMargin,
    },
    subTitleText: {
      ...Gutters.tinyTMargin,
    },
  });
};
