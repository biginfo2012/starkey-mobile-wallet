/* eslint-disable @typescript-eslint/no-unused-vars */
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
    topImageBgView: {
      alignItems: 'center',
      ...Gutters.regularVPadding,
      ...BorderRadius.LargeBorderRadius,
      overflow: 'hidden',
    },
    container: {
      backgroundColor: Colors.inputBackground,
      ...BorderRadius.LargeBorderRadius,
      overflow: 'hidden',
    },
    actionsContainer: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Gutters.regularPadding,
    },
    tabBarContainer: {
      width: '85%',
      backgroundColor: applyOpacityToHexColor(Colors.placeholderColor, 0.18),
    },
  });
};
