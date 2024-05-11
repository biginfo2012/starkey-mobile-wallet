import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    container: {
      ...Gutters.extraTinyVMargin,
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    iconView: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    subView: {
      ...Layout.fill,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Gutters.tinyVMargin,
    },
    icon: {
      width: 16,
      height: 16,
      ...Gutters.tinyRMargin,
    },

    verifyIcon: {
      width: 19,
      height: 19,
      ...Gutters.extraTinyRMargin,
    },
  });
};
