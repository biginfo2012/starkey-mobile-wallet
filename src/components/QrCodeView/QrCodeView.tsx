import React, { forwardRef } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { scale } from 'react-native-size-scaling';
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
  value: string;
  size: number;
};

const QrCodeView = forwardRef((props: Props, ref) => {
  const { Colors, Gutters, Images } = useTheme();

  const { value, size } = props;
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
      <View testID={'qr-code'} style={style(Gutters, Colors).container}>
        <QRCode
          size={size}
          value={value}
          logo={Images.ic_app_logo_with_background}
          logoSize={scale(24)}
          logoMargin={scale(4)}
          logoBackgroundColor={Colors.white}
        />
      </View>
    </ViewShot>
  );
});

export default QrCodeView;
