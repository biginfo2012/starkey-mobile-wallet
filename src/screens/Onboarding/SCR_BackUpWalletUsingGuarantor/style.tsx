import { layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Layout: typeof layout) => {
  return getStyleSheet().create({
    shareBtn: {
      ...Layout.fill,
      ...BorderRadius.MediumBorderRadius,
    },
    bottomView: {
      ...Layout.fill,
      ...Layout.justifyContentEnd,
    },
  });
};
