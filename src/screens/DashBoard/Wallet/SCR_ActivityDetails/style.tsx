import { gutters } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters) => {
  return getStyleSheet().create({
    bottomButton: {
      ...Gutters.tinyVPadding,
    },
    rightIcon: {
      width: 24,
      height: 24,
    },
  });
};
