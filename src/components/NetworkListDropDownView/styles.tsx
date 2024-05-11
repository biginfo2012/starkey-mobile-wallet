import getStyleSheet from 'theme/Helper/currentStyleSheet';

export const style = () => {
  return getStyleSheet().create({
    icon: {
      width: 30,
      height: 30,
    },
  });
};
