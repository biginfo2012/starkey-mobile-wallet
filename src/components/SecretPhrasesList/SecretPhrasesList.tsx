import React from 'react';
import { View, Text, FlatList } from 'react-native';

import useTheme from 'hooks/useTheme';

import VerticalSeparatorView from '../VerticalSeparatorView/VerticalSeparatorView';
import { style } from './style';

type Props = {
  data: any[];
};

export default function SecretPhrasesList({ data }: Props) {
  const { Gutters, Layout, Colors, Fonts } = useTheme();

  return (
    <FlatList
      data={data}
      numColumns={3}
      columnWrapperStyle={style(Gutters, Layout, Colors).flatListColWrapper}
      contentContainerStyle={
        style(Gutters, Layout, Colors).flatListContentContainer
      }
      scrollEnabled={false}
      keyExtractor={item => item.toString()}
      renderItem={({ item, index }) => (
        <View style={style(Gutters, Layout, Colors).flatListItem}>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.textSmallRegular,
            }}
          >
            <Text
              style={{
                ...Fonts.textOpacitySmall,
              }}
            >{`${index + 1}`}</Text>
            <VerticalSeparatorView />
            {`${item}`}
          </Text>
        </View>
      )}
    />
  );
}
