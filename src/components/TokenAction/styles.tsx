import { layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Layout: typeof layout) => {
  return getStyleSheet().create({
    button: {
      ...Layout.center,
    },
    icon: {
      width: 17,
      height: 20,
    },
  });
};
