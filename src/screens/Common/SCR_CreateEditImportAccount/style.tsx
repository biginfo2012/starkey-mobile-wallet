import getStyleSheet from 'theme/Helper/currentStyleSheet';
import { gutters } from 'types/theme';

export const style = (Gutters: typeof gutters) => {
  return getStyleSheet().create({
    avatarContainer: {
      ...Gutters.smallTMargin,
      ...Gutters.mediumBMargin,
      width: 72,
    },
    avatarIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
    },
    penIcon: {
      width: 24,
      height: 24,
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
  });
};
