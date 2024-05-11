import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    container: {
      ...Gutters.smallMargin,
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    icon: {
      ...Gutters.tinyRMargin,
      width: 30,
      height: 30,
    },
  });
};
