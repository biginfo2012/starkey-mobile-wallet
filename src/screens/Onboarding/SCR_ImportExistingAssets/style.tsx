import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (Colors: typeof Variables.Colors) => {
  return getStyleSheet().create({
    subView: {
      backgroundColor: Colors.inputBackground,
      ...BorderRadius.ExtraMediumBorderRadius,
      overflow: 'hidden',
      flexShrink: 1,
    },
  });
};
