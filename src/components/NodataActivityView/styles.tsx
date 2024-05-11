import { gutters } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters) => {
  return getStyleSheet().create({
    icon: {
      width: 120,
      height: 80,
      ...Gutters.smallTMargin,
    },
    button: {
      width: '50%',
    },
  });
};
