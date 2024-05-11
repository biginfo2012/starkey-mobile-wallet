import React, { useMemo, useState } from 'react';
import { Pressable, SectionList, Text, View } from 'react-native';

import AddTokenItem from 'components/AddTokenItem/AddTokenItem';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import Variables from 'theme/Variables';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import { HorizontalSeparatorView, SearchInputBox } from '..';
import { style } from './style';

type Props = {
  items: any;
  testID: string;
  handleIsAddEnable: (items: ExistingNetworksItem[]) => void;
};

const AddTokenListView = (props: Props) => {
  const { items, testID, handleIsAddEnable } = props;
  const { Gutters, Fonts, Colors } = useTheme();

  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);

  useUpdateEffect(() => {
    let tokenList = [];
    if (searchText.trim().length > 0) {
      let searchList = [];
      for (const tokenObj of items) {
        if (tokenObj.title === 'wallet:all') {
          searchList = [];
          searchList = tokenObj?.data?.filter(function (item) {
            return (
              item?.subTitle
                ?.toLowerCase()
                .includes(searchText?.trim().toLowerCase()) ||
              item?.title
                ?.toLowerCase()
                .includes(searchText?.trim().toLowerCase()) ||
              item?.networkName
                ?.toLowerCase()
                .includes(searchText?.trim().toLowerCase())
            );
          });
        }
      }
      tokenList = searchList;
    }

    if (tokenList.length || searchText?.trim() !== '') {
      setFilterData([
        {
          title: tokenList.length
            ? tokenList.length +
              (tokenList?.length > 1
                ? t('setting:results')
                : t('setting:result'))
            : t('common:no_result_found'),
          data: tokenList,
        },
      ]);
    } else {
      setFilterData(items);
    }
  }, [searchText]);

  const tokenListArray = useMemo(() => {
    return filterData.length ? filterData : items;
  }, [searchText, items, filterData]);

  const selectValue = (item: ExistingNetworksItem) => {
    let tempList = [...selectedItems];
    const isExist = selectedItems.includes(item);
    if (!isExist) {
      tempList.push(item);
    } else {
      tempList = tempList.filter(itemTemp => {
        return itemTemp.id !== item.id;
      });
    }
    setSelectedItems(tempList);
    handleIsAddEnable(tempList);
  };

  return (
    <>
      <SearchInputBox
        placeholder={t('wallet:asset_name_symbol')}
        onChangeText={text => {
          setSearchText(text);
        }}
      />

      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />

      <SectionList
        sections={tokenListArray}
        keyExtractor={item => item.id}
        bounces={false}
        renderItem={({ item }) => (
          <Pressable
            testID={testID}
            onPress={() => {
              selectValue(item);
            }}
          >
            <AddTokenItem
              item={item}
              selected={selectedItems.includes(item) ? true : false}
              onSelect={() => {
                selectValue(item);
              }}
            />
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={style(Gutters, Colors).sectionTitleContainer}>
            <Text style={Fonts.textSmallDescriptionBold}>{t(title)}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

export default AddTokenListView;
