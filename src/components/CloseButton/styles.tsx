import getStyleSheet from 'theme/Helper/currentStyleSheet';
import { gutters } from 'types/theme';

export const style = (Gutters: typeof gutters) => {
  return getStyleSheet().create({
    icon: {
      width: 18,
      height: 18,
      ...Gutters.tinyLMargin,
    },
  });
};
