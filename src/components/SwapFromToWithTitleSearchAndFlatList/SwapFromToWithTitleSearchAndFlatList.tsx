import React, { useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';

import {
  DashBoardHeader,
  SearchInputBox,
  SwapFromToRawItem,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';

import { style } from './style';

type Props = {
  handleBackPress: () => void;
  title: string;
  flatListData: [];
  handleOnPress: (obj: any) => void;
  selectedId: any;
};

const SwapFromToWithTitleSearchAndFlatList = (props: Props) => {
  const { handleBackPress, title, flatListData, handleOnPress, selectedId } =
    props;
  const { Gutters, Layout, Common, Images, Colors, Fonts } = useTheme();

  const [searchText, setSearchText] = useState('');

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => handleOnPress(item)}
        style={
          style(Gutters, Layout, Colors, index, flatListData.length)
            .itemContainer
        }
      >
        <SwapFromToRawItem
          item={item}
          selectedId={selectedId}
          onPress={() => handleOnPress(item)}
        />
      </Pressable>
    );
  };

  return (
    <>
      {/* Header */}
      <View style={Layout.fullWidth}>
        <DashBoardHeader
          testID="Wallet_DashBoardHeader"
          containerStyle={Common.smallHPadding}
          leftImage={Images.ic_back}
          onPressLeftImage={handleBackPress}
        />
      </View>

      {/* Root Container */}
      <View style={Common.containerFillWithSmallHPadding}>
        <Text style={[Fonts.textLarge, Gutters.smallVMargin]}>{title}</Text>
        {/* Search Container */}
        <SearchInputBox
          placeholder={t('swap:search_token_name_or_address')}
          onChangeText={setSearchText}
          value={searchText}
          clearButtonMode="while-editing"
        />

        {/* Token List */}
        <View style={style(Gutters, Layout).flatListContainer}>
          <FlatList
            data={flatListData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={Layout.fill}
          />
        </View>
      </View>
    </>
  );
};

export default SwapFromToWithTitleSearchAndFlatList;
