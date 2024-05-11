import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    icon: {
      width: 20,
      height: 20,
    },
    fileUrlView: {
      ...Layout.row,
      ...Gutters.smallVPadding,
    },
  });
};
