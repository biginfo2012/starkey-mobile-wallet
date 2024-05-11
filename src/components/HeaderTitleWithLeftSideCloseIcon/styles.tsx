import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    container: {
      ...Layout.fill,
      ...Gutters.smallTMargin,
      ...Gutters.mediumBMargin,
    },
    icon: {
      width: 32,
      height: 32,
    },
  });
};
