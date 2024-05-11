import React, { forwardRef } from 'react';
import { Image, View } from 'react-native';
import ViewShot from 'react-native-view-shot';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';

import { style } from './style';

/*
ViewShot Component with QRCode
This component is used to capture the content rendered within it as an image and generate a QR code.
It makes use of the 'react-native-view-shot' library to capture the view and obtain an image representation.
The 'QRCode' component is utilized from another library to generate the QR code within the captured view.


fileName: The desired file name for the captured image (without file extension).
format: The format of the captured image (e.g., 'png', 'jpeg').
quality: The quality of the captured image (1 for maximum quality).
result: The desired output format of the captured image ('data-uri' for base64 data URI).
*/

type Props = {
  size: number;
};

const UserProfileView = forwardRef((props: Props, ref) => {
  const { Colors, Gutters, Images } = useTheme();

  const { size } = props;

  return (
    <ViewShot
      ref={ref}
      options={{
        fileName: t('wallet:qr_code_file_name'),
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      }}
    >
      <View
        testID={'user-profile-view'}
        style={[style(Gutters, Colors).container, { borderRadius: size }]}
      >
        <Image
          style={{
            width: size,
            height: size,
          }}
          source={Images.ic_avatar}
          resizeMode="contain"
        />
      </View>
    </ViewShot>
  );
});

export default UserProfileView;
