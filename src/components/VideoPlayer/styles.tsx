import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (Colors: typeof Variables.Colors) => {
  return getStyleSheet().create({
    container: {
      backgroundColor: Colors.inputBackground,
      ...BorderRadius.MediumBorderRadius,
      width: '100%',
      height: 200,
      overflow: 'hidden',
    },
  });
};
