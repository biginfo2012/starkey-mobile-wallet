import { gutters } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = (Gutters: typeof gutters) => {
  return getStyleSheet().create({
    borderButton: { ...Gutters.tinyVPadding, borderRadius: 8 },
  });
};
