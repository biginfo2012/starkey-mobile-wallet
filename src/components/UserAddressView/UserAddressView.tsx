import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { formatAddress } from 'theme/Helper/Address';

import { AddressView } from '..';
import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  userName?: string;
  walletAddress: string;
  iconPath?: ImageSourcePropType;
  containerStyle?: ViewStyle;
};

const UserAddressView = ({
  userName,
  walletAddress,
  iconPath,
  containerStyle,
}: Props) => {
  const { Layout, Gutters, Fonts, Colors } = useTheme();

  return (
    <View style={[style(Gutters, Layout).container, containerStyle]}>
      {iconPath ? (
        typeof iconPath === 'object' ? (
          <LinearGradient
            colors={iconPath}
            useAngle={true}
            angle={200}
            style={style(Gutters, Layout).icon}
          />
        ) : (
          <Image
            style={style(Gutters, Layout).icon}
            resizeMode="contain"
            source={iconPath}
          />
        )
      ) : userName ? (
        <View style={style(Gutters, Layout, Colors).textImage}>
          <Text style={[Fonts.titleSmall, { color: Colors.blackGray }]}>
            {`${userName?.split(' ')[0][0]}`}
          </Text>
        </View>
      ) : (
        <></>
      )}

      {userName && (
        <Text style={[Fonts.titleSmall, Layout.fill]} numberOfLines={1}>
          {userName}
        </Text>
      )}

      {walletAddress && (
        <AddressView
          text={formatAddress(walletAddress, 'short')}
          walletAddress={walletAddress}
        />
      )}
    </View>
  );
};

UserAddressView.defaultProps = {
  userName: '',
  iconPath: '',
  containerStyle: {},
};

export default UserAddressView;
