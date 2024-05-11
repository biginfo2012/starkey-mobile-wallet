import getStyleSheet from 'theme/Helper/currentStyleSheet';
import Variables from 'theme/Variables';
import { layout } from 'types/theme';

export const style = (
  Layout?: typeof layout,
  Colors?: typeof Variables.Colors,
) => {
  return getStyleSheet().create({
    icon: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    textImage: {
      width: 40,
      height: 40,
      backgroundColor: Colors?.white,
      ...Layout?.center,
      borderRadius: 20,
    },
  });
};
