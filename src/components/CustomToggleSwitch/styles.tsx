import { layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Layout: typeof layout,
  Colors: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      width: 56,
      height: 34,
      ...Layout.center,
      ...BorderRadius.ExtraRegularBorderRadius,
    },
    toggle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      ...Layout.center,
      ...Layout.absolute,
    },
    toggleOn: {
      backgroundColor: Colors.white,
      right: 1,
    },
    toggleOff: {
      backgroundColor: Colors.white,
      left: 1,
    },
  });
};
