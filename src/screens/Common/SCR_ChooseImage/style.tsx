import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';
import { gutters, layout } from 'types/theme';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors?: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    container: {
      ...Layout.fill,
      backgroundColor: Colors?.inputBackground,
      ...Gutters.tinyHPadding,
    },
    avatarContainer: {
      ...Gutters.smallTMargin,
      ...Gutters.mediumBMargin,
      width: 72,
    },
    avatarIcon: {
      width: 72,
      height: 72,
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
