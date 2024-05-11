/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { View, FlatList, Pressable } from 'react-native';

import { RecoveryOptionItem } from 'types/applicationInterfaces';

import { RecoverySelectionCard } from '..';
import { style } from './style';

type Props = {
  data: RecoveryOptionItem[];
  onItemPress: (item: RecoveryOptionItem) => void;
};

export default function RecoverySelectionListView({
  data,
  onItemPress,
}: Props) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <>
          <Pressable onPress={() => onItemPress(item)}>
            <RecoverySelectionCard item={item} />
          </Pressable>
        </>
      )}
      ItemSeparatorComponent={() => <View style={style().separatorView} />}
      keyExtractor={item => item.id.toString()}
    />
  );
}
