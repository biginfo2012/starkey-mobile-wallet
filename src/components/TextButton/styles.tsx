import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters, Layout: typeof layout) => {
  return getStyleSheet().create({
    button: {
      ...Gutters.tinySmallHPadding,
      ...Layout.colCenter,
      ...BorderRadius.MediumBorderRadius,
    },
  });
};
