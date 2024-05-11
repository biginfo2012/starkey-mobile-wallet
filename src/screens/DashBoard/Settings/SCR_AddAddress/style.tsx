import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (Colors?: typeof Variables.Colors) => {
  return getStyleSheet().create({
    container: {
      backgroundColor: Colors?.inputBackground,
    },
    headerRightImage: { width: 24, height: 22 },
  });
};
