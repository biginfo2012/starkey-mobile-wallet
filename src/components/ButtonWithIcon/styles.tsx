import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  color: string,
) => {
  return getStyleSheet().create({
    button: {
      ...Gutters.tinySmallPadding,
      ...Layout.row,
      backgroundColor: color,
      ...BorderRadius.MediumBorderRadius,
    },
    icon: {
      width: 16,
      height: 16,
      alignSelf: 'center',
    },
  });
};
