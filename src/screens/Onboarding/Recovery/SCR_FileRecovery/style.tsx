import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Layout: typeof layout, Gutters: typeof gutters) => {
  return getStyleSheet().create({
    checkBoxView: {
      ...Layout.row,
      ...Layout.alignItemsCenter,
    },
    icon: {
      width: 24,
      height: 24,
    },
    bottomButton: {
      ...Gutters.smallTMargin,
    },
  });
};
