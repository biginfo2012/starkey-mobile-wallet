import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    errorImage: {
      height: 32,
      width: 32,
    },
    wrapperView: {
      ...Layout.fill,
      ...Gutters.smallHPadding,
    },
    downloadCopyButtonContainer: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
    },
  });
};
