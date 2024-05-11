import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (Colors: typeof Variables.Colors) => {
  return getStyleSheet().create({
    subTitle: {
      color: Colors.textPurple,
      opacity: 1,
    },
  });
};
