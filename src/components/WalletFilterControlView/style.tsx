import { layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Layout: typeof layout) => {
  return getStyleSheet().create({
    container: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    icon: {
      width: 24,
      height: 24,
    },
  });
};
