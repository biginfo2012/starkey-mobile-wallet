import { gutters } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters) => {
  return getStyleSheet().create({
    loader: {
      ...Gutters.largeTMargin,
    },
    bottomView: {
      ...Gutters.smallBMargin,
    },
    bottomViewTiny: {
      ...Gutters.extraTinyBMargin,
    },
  });
};
