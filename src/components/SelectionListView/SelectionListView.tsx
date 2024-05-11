/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ViewStyle,
  Pressable,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { scale } from 'react-native-size-scaling';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { SortingItem } from 'types/applicationInterfaces';

import FilterSortingHeader from '../FilterSortingHeader/FilterSortingHeader';
import { style } from './style';

/**

SelectionListView Component
This component is a reusable list view designed for selecting items from a list. It provides a user interface
to display a list of items with checkboxes, enabling users to select one or more items.

*/
interface Props {
  multiSelect: boolean;
  items: SortingItem[];
  onDonePress?: (items: SortingItem[]) => void;
  titleText?: string;
  doneBtnText?: string;
  onFilterUpdate: (selectedIds: string[]) => void;
  selectedItemsId: string[];
  onClearPress?: () => void;
  flatListStyle?: ViewStyle;
  shouldHideHeader: boolean;
  customImageStyle?: ViewStyle;
  maxAllowedItemToSelect?: number;
}

const SelectionListView: React.FC<Props> = ({
  multiSelect,
  items,
  onDonePress,
  titleText,
  doneBtnText,
  onFilterUpdate,
  selectedItemsId,
  onClearPress,
  flatListStyle,
  shouldHideHeader,
  customImageStyle,
  maxAllowedItemToSelect,
}) => {
  const { Fonts, Colors, Layout, Gutters } = useTheme();

  const [selectedItemId, setSelectedItemId] =
    useState<string[]>(selectedItemsId);
  const [data, setData] = useState<SortingItem[]>([]);
  const [isDoneButtonEnabled, setIsDoneButtonEnabled] = useState(false);

  useEffect(() => {
    setData(items);
  }, [items]);

  useEffect(() => {
    onFilterUpdate(selectedItemId);
  }, [selectedItemId]);

  useEffect(() => {
    setIsDoneButtonEnabled(selectedItemId.length > 0);
  }, [selectedItemId.length]);

  /*
  The 'toggleCheckBox' function is used to handle item selection and unselection. It manages the 'selectedItemId'
  */
  const toggleCheckBox = (itemId: string) => {
    setSelectedItemId(prevData => {
      if (!prevData.includes(itemId)) {
        if (
          multiSelect &&
          maxAllowedItemToSelect &&
          prevData?.length >= maxAllowedItemToSelect
        ) {
          const updatedData = multiSelect
            ? [...prevData?.pop(), itemId]
            : [itemId];
          return updatedData;
        }
        const updatedData = multiSelect ? [...prevData, itemId] : [itemId];
        return updatedData;
      } else {
        const updatedData = [...prevData.filter(item => item !== itemId)];
        return updatedData;
      }
    });
  };

  /*
  The 'renderItem' function is used by the FlatList to render each item in the list. It displays each item's text and icon along with a BouncyCheckbox component for item selection.
  */
  const renderItem = ({ item }: { item: SortingItem }) => (
    <Pressable
      style={style(Gutters, Layout, Colors, Fonts).flatListItem}
      onPress={() => toggleCheckBox(item.id)}
    >
      <Image
        source={item.image}
        style={[
          style(Gutters, Layout, Colors, Fonts).itemLeftImage,
          customImageStyle,
        ]}
      />
      <View style={style(Gutters, Layout, Colors, Fonts).itemText}>
        <Text style={Fonts.textSmallBold}>{t(item.text)}</Text>
      </View>
      <BouncyCheckbox
        isChecked={selectedItemId.includes(item.id)}
        disableBuiltInState
        iconImageStyle={{ tintColor: Colors.blackGray }}
        fillColor={Colors.textPurple}
        innerIconStyle={{ borderColor: Colors.white }}
        size={scale(18)}
        onPress={() => toggleCheckBox(item.id)}
      />
    </Pressable>
  );

  return (
    <View>
      {!shouldHideHeader && (
        <FilterSortingHeader
          isDoneButtonEnabled={isDoneButtonEnabled}
          titleText={titleText ?? ''}
          doneBtnText={doneBtnText ?? ''}
          onClearPress={() => {
            onClearPress && onClearPress();
            setSelectedItemId([]);
          }}
          onDonePress={() => {
            onDonePress &&
              onDonePress(
                items.filter(item => selectedItemId.includes(item.id)),
              );
          }}
        />
      )}

      <FlatList
        style={[style(Gutters, Layout, Colors, Fonts).flatList, flatListStyle]}
        data={data}
        extraData={selectedItemId}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => (
          <View
            style={style(Gutters, Layout, Colors, Fonts).itemSeparatorView}
          />
        )}
      />
    </View>
  );
};

export default SelectionListView;
