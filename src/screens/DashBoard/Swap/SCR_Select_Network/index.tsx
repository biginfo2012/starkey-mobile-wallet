import React, { useState } from 'react';
import { View, Text, Image, Pressable, SectionList } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { scale } from 'react-native-size-scaling';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  DashBoardHeader,
  SafeAreaWrapper,
  SearchInputBox,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import mockData from 'theme/mockData';

import { style } from './style';

const SelectNetwork = () => {
  const { Gutters, Layout, Common, Images, Colors, Fonts } = useTheme();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const [selectedId, setSelectedId] = useState(null);

  const toggleCheckBox = itemId => {
    setSelectedId(prevSelectedItem => {
      return prevSelectedItem === itemId ? null : itemId;
    });
  };

  const renderNetworkItem = ({ item, index, section }) => {
    return (
      <Pressable
        onPress={() => toggleCheckBox(item.id)}
        style={
          style(Gutters, Layout, Colors, index, section.data.length)
            .itemContainer
        }
      >
        <Image
          style={style(Gutters, Layout).icon}
          resizeMode="contain"
          source={item?.image}
        />
        <View style={style(Gutters, Layout).subView}>
          <Text style={Fonts.titleSmall} numberOfLines={1}>
            {item?.title}
          </Text>
        </View>
        <BouncyCheckbox
          isChecked={selectedId === item.id}
          disableBuiltInState
          iconImageStyle={{ tintColor: Colors.blackGray }}
          fillColor={Colors.textPurple}
          innerIconStyle={{ borderColor: Colors.white }}
          size={scale(18)}
          onPress={() => toggleCheckBox(item.id)}
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaWrapper>
      {/* Header */}
      <View style={Layout.fullWidth}>
        <DashBoardHeader
          testID="Wallet_DashBoardHeader"
          containerStyle={Common.smallHPadding}
          leftImage={Images.ic_back}
          rightImageStyle={style(Gutters, Layout).headerRightImage}
          onPressLeftImage={() => {
            navigation.goBack();
          }}
        />
      </View>

      {/* Root Container */}
      <View style={Common.containerFillWithSmallHPadding}>
        <Text style={[Fonts.textLarge, Gutters.smallVMargin]}>
          {t('swap:network')}
        </Text>

        {/* Search Container */}
        <SearchInputBox
          placeholder={t('common:Search')}
          onChangeText={() => {}}
        />

        {/* Network List */}
        <View style={style(Gutters, Layout).flatListContainer}>
          <SectionList
            sections={mockData.SelectNetworkListData}
            keyExtractor={item => item.id}
            renderItem={renderNetworkItem}
            showsVerticalScrollIndicator={false}
            renderSectionHeader={({ section: { title } }) =>
              title !== '' && (
                <View style={style(Gutters, Layout).sectionTitleContainer}>
                  <Text style={Fonts.textSmallTinyGrayOpacityRegular}>
                    {t(title)}
                  </Text>
                </View>
              )
            }
            contentContainerStyle={Layout.fill}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default SelectNetwork;
