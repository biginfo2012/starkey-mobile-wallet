import React from 'react';
import { View, Pressable, ImageBackground, Image } from 'react-native';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  imgIconPath: string;
  selectedImgIconPath: string;
  onPress: () => void;
};

const AvatarImageView = ({
  imgIconPath,
  selectedImgIconPath,
  onPress,
}: Props) => {
  const { Layout, Colors, Images, Gutters } = useTheme();
  const aspectRatio = 1;

  return (
    <Pressable
      style={[style(Layout, Gutters, Colors).container, { aspectRatio }]}
      onPress={onPress}
    >
      <ImageBackground
        source={imgIconPath}
        resizeMode="cover"
        style={style(Layout, Gutters, Colors).imageBgStyle}
      >
        {selectedImgIconPath === imgIconPath && (
          <>
            <View style={style(Layout, Gutters, Colors).viewBg} />
            <Image
              source={Images.ic_purple_tick}
              style={style(Layout, Gutters, Colors).rightIcon}
            />
          </>
        )}
      </ImageBackground>
    </Pressable>
  );
};

export default AvatarImageView;
