import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    container: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    icon: {
      width: 30,
      height: 30,
    },
  });
};
