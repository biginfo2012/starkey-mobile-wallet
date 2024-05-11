import React, { memo } from 'react';
import { Text, FlatList, Pressable } from 'react-native';

import useTheme from 'hooks/useTheme';
import { getUserDataFromAddress } from 'theme/Helper/common/Function';
import { RecentTrnAddressItem } from 'types/applicationInterfaces';

import { UserAddressView } from '..';
import { style } from './style';

interface Props {
  onPress: (items: RecentTrnAddressItem) => void;
  recentTransactionAddressList: RecentTrnAddressItem[];
  title: string;
}

const RecentTransactionListView: React.FC<Props> = ({
  onPress,
  recentTransactionAddressList,
  title,
}) => {
  const { Fonts, Layout, Gutters, Colors } = useTheme();
  /*
  The 'renderItem' function is used by the FlatList to render each item in the list. It displays each item's text and icon along with a BouncyCheckbox component for item selection.
  */
  const renderUserItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          onPress(item);
        }}
      >
        <UserAddressView
          walletAddress={item.address}
          containerStyle={Gutters.tiny9VPadding}
          userName={
            item?.userName
              ? item?.userName
              : getUserDataFromAddress(item.address)?.userName
          }
          iconPath={
            getUserDataFromAddress(item.address)?.profileIcon ??
            item?.profileIcon
          }
        />
      </Pressable>
    );
  };

  return (
    <>
      <Text
        style={[
          Fonts.textSmallTinyGrayOpacityRegular,
          Layout.fill,
          Gutters.smallLPadding,
        ]}
      >
        {title}
      </Text>
      <FlatList
        data={recentTransactionAddressList}
        bounces={false}
        keyExtractor={item => item.address}
        renderItem={renderUserItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style(Gutters, Colors).userListView}
        scrollEnabled={false}
      />
    </>
  );
};

export default memo(RecentTransactionListView);
