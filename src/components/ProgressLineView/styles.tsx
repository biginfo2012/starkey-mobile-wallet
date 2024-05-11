import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = () => {
  return getStyleSheet().create({
    viewLine: {
      width: 8,
      height: 4,
      borderRadius: 4,
    },
  });
};
