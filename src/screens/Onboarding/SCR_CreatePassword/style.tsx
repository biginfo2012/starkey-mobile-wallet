import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Layout: typeof layout, Gutters: typeof gutters) => {
  return getStyleSheet().create({
    wrapperView: {
      ...Gutters.smallHPadding,
    },
    bottomView: {
      ...Layout.fill,
      ...Layout.justifyContentEnd,
    },
  });
};
