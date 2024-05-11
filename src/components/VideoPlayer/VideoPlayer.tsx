import React, { Dispatch, SetStateAction } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import Video from 'react-native-video';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  videoUrl: string;
  isVideoPaused: boolean;
  shouldShowVideoBtn: boolean;
  setShouldShowVideoBtn: Dispatch<SetStateAction<boolean>>;
};

const VideoPlayer = ({
  videoUrl,
  isVideoPaused,
  shouldShowVideoBtn,
  setShouldShowVideoBtn,
}: Props) => {
  const { Images, Layout, Colors } = useTheme();

  const bufferConfig = {
    minBufferMs: 15000,
    maxBufferMs: 50000,
    bufferForPlaybackMs: 2500,
    bufferForPlaybackAfterRebufferMs: 5000,
  };

  return (
    <View style={[style(Colors).container, Layout.center]}>
      {shouldShowVideoBtn ? (
        <TouchableOpacity
          onPress={() => {
            setShouldShowVideoBtn(false);
          }}
        >
          <Image
            style={{ width: scale(48), height: scale(48) }}
            source={Images.ic_play}
          />
        </TouchableOpacity>
      ) : (
        <Video
          source={{
            uri: videoUrl,
          }}
          style={style(Colors).container}
          onError={(event: any) => {
            console.log('Video Error ::', event);
          }}
          bufferConfig={bufferConfig}
          controls={true}
          resizeMode={'stretch'}
          paused={isVideoPaused}
        />
      )}
    </View>
  );
};

export default VideoPlayer;
