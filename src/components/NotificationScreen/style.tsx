import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors?: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    modal: {
      margin: 0,
      ...Layout.fill,
    },
    container: {
      ...Layout.fill,
      ...Gutters.largeVPadding,
      backgroundColor: Colors?.inputBackground,
    },
    rowContainer: {
      ...Layout.rowHCenter,
      ...Gutters.smallHPadding,
      ...Gutters.tinyVPadding,
    },
    image: {
      height: 44,
      width: 44,
    },
    textContainer: {
      ...Layout.fill,
      ...Gutters.tinyHMargin,
    },
    time: {
      ...Gutters.tooExtraTinyTMargin,
    },
  });
};
