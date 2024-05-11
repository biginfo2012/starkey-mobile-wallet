import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    icon: {
      width: 30,
      height: 30,
    },
    subView: {
      ...Layout.fill,
      ...Gutters.tinyMargin,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.alignItemsCenter,
    },
    checkBox: {
      ...Gutters.extraTinyLMargin,
    },
  });
};
