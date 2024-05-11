import { layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Layout: typeof layout) => {
  return getStyleSheet().create({
    bottomView: {
      ...Layout.fill,
      ...Layout.justifyContentEnd,
    },
  });
};
