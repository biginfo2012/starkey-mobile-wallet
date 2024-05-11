/* eslint-disable react/no-unstable-nested-components */

/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  DashBoardHeader,
  HorizontalSeparatorView,
  NodataActivityView,
  SafeAreaWrapper,
  SearchInputBox,
  SortByFilterBottomSheetView,
  UserAddressView,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { removeAddressFromBook } from 'store/addressBook';
import { RootState } from 'store/index';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import { showToast } from 'theme/Helper/common/Function';
import { NetWorkType } from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import mockData from 'theme/mockData';
import ScreenNames from 'theme/screenNames';
import { AddressItem } from 'types/applicationInterfaces';

import { style } from './style';

const AddressBook: React.FC<any> = () => {
  let prevOpenedRow;

  const { Common, Gutters, Layout, Fonts, Images, Colors } = useTheme();

  const data = useRoute().params as any;

  // const { title } = useRoute().params as any;

  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch();

  const [viewType, setViewType] = useState(t('common:default'));

  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const addressBookList = useSelector((state: RootState) => {
    return state.addressBook.addressBookList;
  });
  const [usersAddressList, setUsersAddressList] = useState<AddressItem>([]);
  const [filterData, setFilterData] = useState<AddressItem>([]);

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    let filterUserList = [];
    if (data?.selectedAddress) {
      if (data?.isEVMNetwork) {
        filterUserList = addressBookList.filter(
          item => item.isEVMNetwork === true,
        );
      } else {
        if (
          data?.shortName === NetWorkType.APT ||
          data?.shortName === NetWorkType.SUP
        ) {
          filterUserList = addressBookList.filter(
            item =>
              item.shortName === NetWorkType.APT ||
              item.shortName === NetWorkType.SUP,
          );
        } else {
          filterUserList = addressBookList.filter(
            item => item.shortName === data?.shortName,
          );
        }
      }
      setUsersAddressList(filterUserList);
    } else {
      setUsersAddressList(addressBookList);
    }
  }, [addressBookList]);

  // Group items in usersAddressList by 'networkName' for SectionList
  const groupedData = usersAddressList.reduce((acc, item) => {
    // Group items by 'type' for SectionList
    const existingSection = acc.find(
      section => section.title === item.networkName,
    );
    if (existingSection) {
      existingSection.data.push(item);
    } else {
      acc.push({ title: item.networkName, data: [item] });
    }
    return acc;
  }, []);

  const handleAddAddress = () => {
    setSearchText('');
    navigation.navigate(ScreenNames.AddAddress, {
      title: 'setting:add_address',
    });
  };

  const handleDelete = (item: AddressItem) => {
    dispatch(
      removeAddressFromBook({
        data: item,
      }),
    );
    showToast('success', t('common:address_removed'));
  };

  useEffect(() => {
    if (searchText.trim().length > 0) {
      if (viewType !== t('common:default')) {
        setViewType(t('common:default'));
      }
      let temList = [...usersAddressList];
      let filteredData = temList?.filter(function (item) {
        return item?.userName
          .toLowerCase()
          .includes(searchText?.trim().toLowerCase());
      });
      setFilterData([...filteredData]);
    }
  }, [searchText, usersAddressList]);

  const addressListArray = useMemo(() => {
    return searchText.trim().length > 0 ? filterData : usersAddressList;
  }, [searchText, usersAddressList, filterData]);

  const renderAddressItem = ({ item, index, section }) => {
    let swipeableRef;
    return (
      <Swipeable
        ref={ref => (swipeableRef = ref)}
        renderRightActions={() => (
          <View style={style(Gutters, Layout).deleteRootContainer}>
            <TouchableOpacity
              style={style(Gutters, Layout, Colors).deleteContainer}
              onPress={() => handleDelete(item)}
            >
              <Image
                style={style(Gutters, Layout).deleteIcon}
                resizeMode="contain"
                source={Images.ic_delete}
              />
            </TouchableOpacity>
          </View>
        )}
        onSwipeableOpen={() => {
          if (prevOpenedRow && prevOpenedRow !== swipeableRef) {
            prevOpenedRow.close();
          }
          prevOpenedRow = swipeableRef;
        }}
      >
        <Pressable
          onPress={() => {
            if (data?.selectedAddress) {
              data?.selectedAddress(item);
              navigation.goBack();
            }
          }}
        >
          <UserAddressView
            iconPath={item?.profileIcon}
            userName={item?.userName}
            walletAddress={item?.address}
            containerStyle={
              style(
                Gutters,
                Layout,
                Colors,
                index,
                viewType === t('common:default')
                  ? addressListArray.length
                  : section.data.length,
              ).itemContainer
            }
          />
        </Pressable>
      </Swipeable>
    );
  };

  const SectionHeader = ({ sectionTitle }) => {
    return (
      <View style={style(Gutters, Layout).sectionTitleContainer}>
        <Text style={Fonts.textSmallTinyGrayOpacityRegular}>
          {sectionTitle + ' ' + t('swap:network')}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <View style={Common.containerFillWithSmallHPadding}>
        <DashBoardHeader
          leftImage={Images.ic_back}
          rightImage={Images.ic_add}
          rightImageStyle={style(Gutters, Layout).headerRightImage}
          rightSideSecondImage={!data?.shortName && Images.ic_more}
          onPressLeftImage={() => {
            navigation.goBack();
          }}
          onPressRightImage={handleAddAddress}
          onPressRightSideSecondImage={() => {
            !data?.shortName && setOpenBottomSheet(true);
          }}
        />

        <Text style={[Fonts.titleLarge, Gutters.smallTMargin]}>
          {t('setting:scr_title_address_book')}
        </Text>
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />

        {usersAddressList?.length ? (
          <>
            <SearchInputBox
              placeholder={t('common:Search')}
              value={searchText}
              onChangeText={(text: string) => {
                setSearchText(text);
              }}
              backGroundColor={applyOpacityToHexColor(
                Colors.bottomButtonBG,
                0.24,
              )}
              rightIcon={searchText ? Images.ic_close_gray : undefined}
              imgIconStyle={style(Gutters, Layout, Colors).closeIconStyle}
              onPressSort={() => {
                setSearchText('');
              }}
            />
          </>
        ) : (
          <></>
        )}

        {searchText.trim().length > 0 && addressListArray?.length ? (
          <>
            <Text style={[Fonts.textSmallDescriptionBold]}>
              {addressListArray?.length +
                (addressListArray?.length > 1
                  ? t('setting:results')
                  : t('setting:result'))}
            </Text>
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.tiny} />
          </>
        ) : (
          <></>
        )}

        {addressListArray?.length ? (
          <View style={Layout.fill}>
            {viewType === t('common:default') ? (
              <>
                <HorizontalSeparatorView
                  spacing={Variables.MetricsSizes.small}
                />
                <FlatList
                  data={addressListArray}
                  keyExtractor={item => item.id}
                  renderItem={renderAddressItem}
                />
              </>
            ) : (
              <SectionList
                sections={groupedData}
                keyExtractor={item => item.id}
                renderItem={renderAddressItem}
                renderSectionHeader={({ section: { title } }) => (
                  <SectionHeader sectionTitle={title} />
                )}
              />
            )}
          </View>
        ) : (
          <View style={style(Gutters, Layout, Colors).noDataContainer}>
            <NodataActivityView
              text={t('setting:no_addresses_yet')}
              iconPath={Images.ic_empty_activity}
              buttonText={t('setting:add_address')}
              onButtonPress={handleAddAddress}
            />
          </View>
        )}
      </View>

      {openBottomSheet ? (
        <SortByFilterBottomSheetView
          snapPointsVal={'40%'}
          hasMultipleSections
          multiSelect={false}
          title={t('setting:scr_title_address_book')}
          onDonePress={item => {
            setOpenBottomSheet(false);
            setViewType(t(item[0].text));
            setSearchText('');
          }}
          onClearPress={() => {
            setViewType(t('common:default'));
            setSearchText('');
          }}
          isSheetOpen={openBottomSheet}
          onChange={() => {}}
          items={mockData.AddressBookFilterData}
          onClose={() => {
            setOpenBottomSheet(false);
            setViewType(t('common:default'));
            setSearchText('');
          }}
          selectedItemsId={viewType === t('common:default') ? ['1'] : ['2']}
          enablePanDownToClose={true}
        />
      ) : (
        <></>
      )}
    </SafeAreaWrapper>
  );
};

export default AddressBook;
