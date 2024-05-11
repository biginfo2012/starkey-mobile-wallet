import React from 'react';
import { Image, ImageSourcePropType, Pressable, ViewStyle } from 'react-native';

import useTheme from 'hooks/useTheme';
import Images from 'theme/Images';
import Variables from 'theme/Variables';

import { style } from './styles';

type Props = {
  iconPath?: ImageSourcePropType;
  containerStyle?: ViewStyle;
  onPress: () => void;
};

const CloseButton = ({ iconPath, containerStyle, onPress }: Props) => {
  const { Gutters } = useTheme();

  return (
    <Pressable hitSlop={10} onPress={onPress}>
      <Image
        resizeMode={'contain'}
        source={iconPath}
        style={[style(Gutters).icon, containerStyle]}
      />
    </Pressable>
  );
};

CloseButton.defaultProps = {
  iconPath: Images(Variables).ic_close_gray,
  containerStyle: {},
};

export default CloseButton;
