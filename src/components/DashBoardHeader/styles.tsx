import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { gutters, layout } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Layout: typeof layout,
  Gutters: typeof gutters,
  Colors?: typeof Variables.Colors,
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inset = useSafeAreaInsets();
  return getStyleSheet().create({
    container: {
      ...Layout.rowHCenter,
      ...Layout.justifyContentBetween,
      ...(inset.bottom === 0 && Gutters.tinyTMargin),
    },
    rightLeftIcon: {
      ...Gutters.smallRMargin,
    },
    textImage: {
      width: 32,
      height: 32,
      backgroundColor: Colors?.white,
      ...Layout.center,
      ...BorderRadius.ExtraMediumBorderRadius,
    },
    profileImage: {
      width: 32,
      height: 32,
      ...BorderRadius.ExtraMediumBorderRadius,
    },
  });
};
