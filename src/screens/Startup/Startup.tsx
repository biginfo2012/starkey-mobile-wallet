import React, { useEffect } from 'react';
import { Image, Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';

import i18next from 'i18next';
import BiometricService from 'services/BiometricService';
import { RootState } from 'store/index';

import { ApplicationScreenProps } from '../../../@types/navigation';
import {
  BackgroundView,
  HorizontalSeparatorView,
  SafeAreaWrapper,
} from '../../components';
import { useTheme } from '../../hooks';
import { setDefaultTheme } from '../../store/theme';
import { style } from './style';

const Startup = ({ navigation }: ApplicationScreenProps) => {
  const { Images, Gutters, Layout } = useTheme();
  const isFaceIdEnabled = useSelector(
    (state: RootState) => state.userInfo.data.config?.isFaceIdEnabled,
  );

  /*
   Waits for a 2-second delay using a Promise and setTimeout to simulate an initial loading period.
   Sets the default theme with an optional 'darkMode' parameter to null.
   Resets the navigation state to a new stack, pointing to the 'Main' route.
  */
  const init = async () => {
    if (isFaceIdEnabled) {
      const response = await BiometricService.authenticate(
        'Authenticate using biometric',
      );
      if (!response.success) {
        return;
      }
    }
    await new Promise(resolve =>
      setTimeout(() => {
        resolve(true);
        i18next.changeLanguage('en');
      }, 2000),
    );
    await setDefaultTheme({ darkMode: null });
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_bg_welcome} />
      <View style={style(Gutters, Layout).subView}>
        <Image
          testID={'brand-img'}
          style={[Layout.fullSize, style(Gutters, Layout).icon]}
          source={Images.ic_appLogo}
        />
        <Image
          style={style(Gutters, Layout).appNameImg}
          source={Images.ic_app_name}
          resizeMode="contain"
        />
        <HorizontalSeparatorView spacing={16} />
        {isFaceIdEnabled && (
          <Pressable onPress={init}>
            <Image
              testID={'face-id'}
              style={[Layout.fullSize, style(Gutters, Layout).faceId]}
              source={Images.ic_face_id}
            />
          </Pressable>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default Startup;
