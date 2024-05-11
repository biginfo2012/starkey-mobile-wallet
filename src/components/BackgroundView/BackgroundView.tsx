import React from 'react';
import { ImageBackground } from 'react-native';

import { DeviceMetrics } from 'theme/Helper/constant';

import { useTheme } from '../../hooks';

type Props = {
  image: any;
  isFullScreen?: boolean;
  bottom?: number;
  opacity?: number;
};

const BackgroundView = (props: Props) => {
  const { Layout } = useTheme();

  const { image, isFullScreen, bottom, opacity } = props;
  return (
    <ImageBackground
      style={[
        { opacity },
        Layout.absoluteFill,
        isFullScreen
          ? { bottom }
          : {
              height:
                DeviceMetrics.screenHeight *
                (DeviceMetrics.hasNotch ? 0.68 : 0.74),
            },
      ]}
      source={image}
    />
  );
};

BackgroundView.defaultProps = {
  isFullScreen: true,
  bottom: 0,
  opacity: 1,
};

export default BackgroundView;
