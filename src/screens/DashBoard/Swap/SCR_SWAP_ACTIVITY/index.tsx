import React from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DashBoardHeader, SafeAreaWrapper } from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import mockData from 'theme/mockData';

import { style } from './style';

const SwapActivity = () => {
  const { Gutters, Layout, Common, Images, Colors, Fonts } = useTheme();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const renderItem = ({ item }) => {
    return (
      <Pressable>
        <View style={style(Gutters, Layout).itemContainer}>
          <View style={Layout.row}>
            <Image
              style={style(Gutters, Layout).icon}
              resizeMode="contain"
              source={item?.swapFromImage}
            />
            <Image
              style={[
                style(Gutters, Layout, Colors).icon,
                style(Gutters, Layout, Colors).iconMarginLeft,
              ]}
              resizeMode="contain"
              source={item?.swapToImage}
            />
          </View>
          <View style={style(Gutters, Layout).subView}>
            <View style={[Layout.fill]}>
              <Text style={[Fonts.titleSmall]} numberOfLines={1}>
                {item?.title}
              </Text>
              <Text style={[Fonts.textTinyGrayLightRegular]}>
                {item?.swapTime}
              </Text>
            </View>
            <View style={[Layout.alignItemsEnd]}>
              <Text style={[Fonts.titleSmall]}>{item?.amount}</Text>
              <Text
                style={[
                  Fonts.textTinyGrayLightRegular,
                  {
                    color:
                      item?.status === '1' ? Colors.textPurple : Colors.white,
                  },
                ]}
              >
                {item?.swapStatus}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaWrapper>
      <View style={Layout.fullWidth}>
        <DashBoardHeader
          testID="Wallet_DashBoardHeader"
          containerStyle={Common.smallHPadding}
          leftImage={Images.ic_back}
          onPressLeftImage={() => {
            navigation.goBack();
          }}
        />
      </View>

      {/* Root Container */}
      <View style={Common.containerFillWithSmallHPadding}>
        <Text style={[Fonts.textLarge, Gutters.smallVMargin]}>
          {t('swap:swap_activity')}
        </Text>

        {/* Swap Activity List */}
        <View style={style(Gutters, Layout).flatListContainer}>
          <FlatList
            data={mockData.SwapActivityListData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={Layout.fill}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default SwapActivity;
