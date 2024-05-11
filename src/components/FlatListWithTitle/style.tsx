import { gutters, layout } from 'theme';
import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';

export const style = (
  Gutters: typeof gutters,
  Layout: typeof layout,
  Colors?: typeof Variables.Colors,
  index?: number,
  length?: number,
) => {
  return getStyleSheet().create({
    rowRootContainer: {
      ...Layout.row,
      ...Gutters.tinyMediumVPadding,
      ...Gutters.tinyMediumVPadding,
      ...Gutters.smallHPadding,
      backgroundColor: Colors?.textGray800,
      borderTopLeftRadius: index === 0 ? 14 : 0, // for first item left
      borderTopRightRadius: index === 0 ? 14 : 0, // for first item right
      borderBottomLeftRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item left
      borderBottomRightRadius: index === (length ?? 1) - 1 ? 14 : 0, // for last item right
    },
    icon: {
      width: 22,
      height: 22,
      marginLeft: 8,
    },
  });
};
