import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { scale } from 'react-native-size-scaling';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { formatAddress } from 'theme/Helper/Address';
import { getWalletAddress } from 'theme/Helper/common/Function';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import { AddressView } from '..';
import { style } from './styles';

type NetworkFilterProps = {
  onPress: () => void;
  item: ExistingNetworksItem;
  selectedItem: ExistingNetworksItem;
  onCreatePress: () => void;
};

const NetworkFilterRawItem = (props: NetworkFilterProps) => {
  const { Fonts, Gutters, Layout, Colors } = useTheme();

  const { onPress, item, selectedItem, onCreatePress } = props;
  return (
    <>
      {item?.image ? (
        <Image
          style={style(Gutters, Layout).icon}
          resizeMode="contain"
          source={
            typeof item?.image === 'string' ? { uri: item?.image } : item?.image
          }
        />
      ) : (
        <View style={style(Gutters, Layout, Colors).textImage}>
          <Text style={[Fonts.titleSmall, { color: Colors.blackGray }]}>
            {`${item?.title?.split(' ')[0][0]}`}
          </Text>
        </View>
      )}
      <View style={style(Gutters, Layout).subView}>
        <Text style={[Fonts.titleSmall, Layout.fill]} numberOfLines={1}>
          {item?.subTitle}
        </Text>
        {getWalletAddress(item?.networkName, item?.isEVMNetwork) ? (
          <AddressView
            text={formatAddress(
              getWalletAddress(item?.networkName, item?.isEVMNetwork),
              'short',
            )}
            walletAddress={getWalletAddress(
              item?.networkName,
              item?.isEVMNetwork,
            )}
          />
        ) : (
          <Pressable
            style={style(Gutters, Layout, Colors).addressContainer}
            onPress={onCreatePress}
          >
            <Text style={Fonts.textSmallTinyWhiteBold} numberOfLines={1}>
              {t('wallet:create')}
            </Text>
          </Pressable>
        )}
      </View>
      <BouncyCheckbox
        isChecked={selectedItem?.id === item.id}
        disableBuiltInState
        iconImageStyle={{ tintColor: Colors.blackGray }}
        fillColor={Colors.textPurple}
        innerIconStyle={{ borderColor: Colors.white }}
        size={scale(18)}
        onPress={onPress}
      />
    </>
  );
};

export default NetworkFilterRawItem;
