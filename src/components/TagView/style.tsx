import { gutters } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters) => {
  return getStyleSheet().create({
    container: {
      borderRadius: 12,
      ...Gutters.extraTinyVPadding,
      ...Gutters.tinyHPadding,
    },
  });
};
