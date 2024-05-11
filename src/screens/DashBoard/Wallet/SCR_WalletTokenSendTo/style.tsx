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
    headerRightImage: { ...BorderRadius.ExtraMediumBorderRadius },
    addressBook: {
      ...Gutters.tinyMediumHPadding,
      backgroundColor: applyOpacityToHexColor(Colors.border, 0.3),
      borderWidth: 0,
    },
    addressBookText: {
      color: Colors.textPurple,
    },
    maxBtn: {
      ...Gutters.tinyVPadding,
      ...Gutters.tinyMediumHPadding,
      backgroundColor: applyOpacityToHexColor(Colors.border, 0.3),
      borderWidth: 0,
    },
    bottomButton: {
      ...BorderRadius.MediumBorderRadius,
      ...Gutters.mediumBMargin,
    },
    userView: {
      ...Gutters.tinySmallHPadding,
      ...Gutters.tiny9VPadding,
      ...Layout.row,
      ...BorderRadius.MediumBorderRadius,
      ...Layout.center,
      backgroundColor: Colors.inputBackground,
    },
    userListView: {
      ...Gutters.tiny9VPadding,
      ...BorderRadius.MediumBorderRadius,
    },
  });
};
