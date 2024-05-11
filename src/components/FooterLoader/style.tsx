import { layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Layout: typeof layout) => {
  return getStyleSheet().create({
    container: {
      height: 50,
      ...Layout.center,
    },
  });
};
