/* eslint-disable react-hooks/rules-of-hooks */
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { gutters } from 'theme';
import BorderRadius from 'theme/BorderRadius';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Colors: typeof Variables.Colors,
) => {
  const inset = useSafeAreaInsets();

  return getStyleSheet().create({
    container: {
      backgroundColor: Colors.inputBackground,
      ...Gutters.regularPadding,
      ...(inset.bottom === 0
        ? Gutters.regularBPadding
        : Gutters.semiLargeBPadding),
      ...BorderRadius.LargeTopBorderRadius,
    },
  });
};
