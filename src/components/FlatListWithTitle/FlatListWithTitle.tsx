import React from 'react';
import { View, Text, FlatList, Pressable, Image } from 'react-native';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RawItem } from 'types/applicationInterfaces';

import { HeaderWithTitleAndSubTitle } from '..';
import { style } from './style';

type Props = {
  title: string;
  flatListData: RawItem[];
  selectedItem: any;
};

const FlatListWithTitle = (props: Props) => {
  const { title, flatListData, selectedItem } = props;

  const { Common, Gutters, Layout, Colors, Fonts, Images } = useTheme();

  const handleClick = () => {
    // TODO:
  };

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={handleClick}
        style={
          style(Gutters, Layout, Colors, index, flatListData.length)
            .rowRootContainer
        }
      >
        <Text style={[Fonts.titleSmall, Layout.fill]}>{item?.title}</Text>
        {selectedItem === item?.shortName && (
          <Image
            style={style(Gutters, Layout).icon}
            resizeMode="contain"
            source={Images.ic_purple_tick}
          />
        )}
      </Pressable>
    );
  };

  return (
    <View style={Common.containerFillWithSmallHPadding}>
      <HeaderWithTitleAndSubTitle title={t(title)} />

      <FlatList
        data={flatListData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={[Layout.fill, Gutters.smallVMargin]}
        initialNumToRender={flatListData.length + 1}
      />
    </View>
  );
};

export default FlatListWithTitle;
