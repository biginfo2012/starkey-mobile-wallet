import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = () => {
  return getStyleSheet().create({
    container: {
      height: 8,
      width: 8,
      borderRadius: 4,
    },
  });
};
