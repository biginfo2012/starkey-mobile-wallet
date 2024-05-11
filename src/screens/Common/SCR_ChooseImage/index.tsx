import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  AvatarImageView,
  DashBoardHeader,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import Variables from 'theme/Variables';
import mockData from 'theme/mockData';

import { style } from './style';

const ChooseImage = () => {
  const { Colors, Layout, Gutters } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [imgIcon, setImgIcon] = useState('');
  const { selectedImgIconPath, imgIconPath } = useRoute().params as any;

  useEffect(() => {
    if (imgIconPath) {
      setImgIcon(imgIconPath);
    }
  }, [imgIconPath]);

  const renderAvatarItem = ({ item }) => (
    <AvatarImageView
      imgIconPath={item.image}
      selectedImgIconPath={imgIcon}
      onPress={() => {
        setImgIcon(item.image);
      }}
    />
  );

  return (
    <View style={[style(Gutters, Layout, Colors).container]}>
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
      <DashBoardHeader
        containerStyle={Gutters.tinyHPadding}
        onPressLeftImage={() => {
          navigation.goBack();
        }}
        onPressRightImage={() => {
          selectedImgIconPath(imgIcon);
          navigation.goBack();
        }}
        shouldShowCancel={true}
        shouldShowClear={true}
        leftText={t('common:cancel')}
        rightText={t('common:Done')}
        isRightButtonDisabled={imgIcon === ''}
      />
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
      <View style={Gutters.tinyHPadding}>
        <HeaderWithTitleAndSubTitle
          shouldHideBack={true}
          title={t('setting:choose_image')}
          hasLargeTitle
        />
      </View>
      <FlatList
        style={Layout.fullWidth}
        numColumns={2}
        bounces={false}
        data={mockData.ProfileImagesList}
        renderItem={renderAvatarItem}
        contentContainerStyle={Gutters.smallBPadding}
        keyExtractor={item => item.image.toString()}
      />
    </View>
  );
};

export default ChooseImage;
