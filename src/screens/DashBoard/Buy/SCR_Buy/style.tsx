import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    subView: {
      ...Layout.fill,
      ...Gutters.tinySmallPadding,
      ...Layout.colCenter,
    },
  });
};
