import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    wrapperView: {
      ...Layout.fill,
      ...Gutters.smallHPadding,
    },
    customImage: { height: 28, width: 28 },
  });
};
