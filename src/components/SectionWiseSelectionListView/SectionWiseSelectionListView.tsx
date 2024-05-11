/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { scale } from 'react-native-size-scaling';

import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { getItemByIdFromSectionArray } from 'theme/Helper/ArrayUtils';
import { DeviceMetrics } from 'theme/Helper/constant';
import { SortingItem } from 'types/applicationInterfaces';

import FilterSortingHeader from '../FilterSortingHeader/FilterSortingHeader';
import { style } from './style';

interface Props {
  multiSelect: boolean;
  items: [{ title: string; data: SortingItem[] }];
  onDonePress: (items: SortingItem[]) => void;
  titleText: string;
  doneBtnText: string;
  onFilterUpdate: (selectedIds: string[]) => void;
  selectedItemsId: string[];
  onClearPress: () => void;
}

const SectionWiseSelectionListView: React.FC<Props> = ({
  multiSelect,
  items,
  onDonePress,
  titleText,
  doneBtnText,
  onFilterUpdate,
  selectedItemsId,
  onClearPress,
}) => {
  const { Fonts, Colors, Layout, Gutters } = useTheme();

  const [selectedItemId, setSelectedItemId] =
    useState<string[]>(selectedItemsId);
  const [data, setData] = useState<[{ title: string; data: SortingItem[] }]>(
    [],
  );
  const [isDoneButtonEnabled, setIsDoneButtonEnabled] = useState(false);

  useEffect(() => {
    setData(items);
  }, [items]);

  useEffect(() => {
    setIsDoneButtonEnabled(selectedItemId.length > 0);
  }, [selectedItemId.length]);

  useEffect(() => {
    onFilterUpdate(selectedItemId);
  }, [selectedItemId]);

  const toggleCheckBox = (itemId: string) => {
    setSelectedItemId(prevData => {
      if (!prevData.includes(itemId)) {
        const updatedData = multiSelect ? [...prevData, itemId] : [itemId];
        return updatedData;
      } else {
        const updatedData = [...prevData.filter(item => item !== itemId)];
        return updatedData;
      }
    });
  };

  const renderItem = ({
    item,
    section,
    index,
  }: {
    item: SortingItem;
    section: any;
    index: any;
  }) => (
    <Pressable
      onPress={() => toggleCheckBox(item.id)}
      style={[
        style(Gutters, Layout, Colors, Fonts).flatListItem,
        index === 0
          ? {
              borderTopLeftRadius: scale(16),
              borderTopRightRadius: scale(16),
              borderBottomLeftRadius: section.data.length === 1 ? scale(16) : 0,
              borderBottomRightRadius:
                section.data.length === 1 ? scale(16) : 0,
            }
          : index === section.data.length - 1
          ? {
              borderBottomLeftRadius: scale(16),
              borderBottomRightRadius: scale(16),
            }
          : { borderWidth: 0, borderRadius: 0 },
        index === section.data.length - 1 ? { marginBottom: scale(16) } : {},
      ]}
    >
      {item.image && (
        <Image
          source={item.image}
          style={style(Gutters, Layout, Colors, Fonts).itemLeftImage}
        />
      )}
      <View style={style(Gutters, Layout, Colors, Fonts).itemText}>
        <Text style={Fonts.textSmallBold}>{t(item.text)}</Text>
      </View>
      <BouncyCheckbox
        isChecked={selectedItemId.includes(item.id)}
        disableBuiltInState
        onPress={() => toggleCheckBox(item.id)}
        iconImageStyle={{ tintColor: Colors.blackGray }}
        fillColor={Colors.textPurple}
        innerIconStyle={{ borderColor: Colors.white }}
        size={scale(18)}
      />
    </Pressable>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <Text style={style(Gutters, Layout, Colors, Fonts).headerSectionText}>
      {t(section.title)}
    </Text>
  );

  return (
    <View style={style(Gutters, Layout, Colors, Fonts).container}>
      <FilterSortingHeader
        isDoneButtonEnabled={isDoneButtonEnabled}
        titleText={titleText}
        doneBtnText={doneBtnText}
        onClearPress={() => {
          onClearPress();
          setSelectedItemId([]);
        }}
        onDonePress={() => {
          onDonePress(getItemByIdFromSectionArray(items, selectedItemId));
        }}
      />
      <BottomSheetSectionList
        style={style(Gutters, Layout, Colors, Fonts).flatList}
        sections={data}
        extraData={selectedItemId}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          paddingBottom: DeviceMetrics.bottomTabBarHeight,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SectionWiseSelectionListView;
