import { gutters } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters) => {
  return getStyleSheet().create({
    rootContainer: { marginTop: -80 },
    appNameImg: {
      height: 32,
      width: 200,
      ...Gutters.tinyMediumMargin,
    },
  });
};
