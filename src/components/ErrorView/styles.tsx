import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    container: {
      ...Gutters.tinyVMargin,
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    icon: {
      ...Gutters.extraTinyRMargin,
      width: 18,
      height: 18,
    },
  });
};
