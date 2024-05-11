import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    subView: {
      ...Layout.fill,
      ...Gutters.tinySmallPadding,
      ...Layout.colCenter,
    },
    icon: { height: 160, width: 160 },
    faceId: { height: 56, width: 56 },
    appNameImg: {
      height: 40,
      width: 200,
    },
  });
};
