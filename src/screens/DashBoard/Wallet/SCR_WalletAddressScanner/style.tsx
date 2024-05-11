import { layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Layout: typeof layout) => {
  return getStyleSheet().create({
    rootCamera: { width: '100%', height: '100%' },
    cancelView: {
      ...Layout.absolute,
      height: 100,
      ...Layout.justifyContentEnd,
    },
  });
};
