import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    rawRootContainer: {
      ...Gutters.tinyMediumVPadding,
      ...Gutters.smallHPadding,
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.alignItemsCenter,
    },
    image: {
      height: 12,
      width: 12,
    },
  });
};
