import React from 'react';
import { View, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';

import HeaderTitleWithLeftSideCloseIcon from 'components/HeaderTitleWithLeftSideCloseIcon/HeaderTitleWithLeftSideCloseIcon';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import { hideNotificationList } from 'theme/Helper/common/Function';
import mockData from 'theme/mockData';

import NotificationRawItem from './NotificationRawItem';
import { style } from './style';

const NotificationScreen = () => {
  const { Layout, Gutters, Colors } = useTheme();

  const notificationData = useSelector((state: RootState) => {
    return state.popupModelReducer.notificationData;
  });

  const { isVisible } = notificationData;

  const onPressHandle = () => {
    // TODO:
  };

  const renderItem = ({ item }) => {
    return <NotificationRawItem item={item} onPress={onPressHandle} />;
  };

  return (
    <Modal
      isVisible={isVisible}
      coverScreen={true}
      style={style(Gutters, Layout).modal}
    >
      <View style={style(Gutters, Layout, Colors).container}>
        <View style={Gutters.smallHPadding}>
          <HeaderTitleWithLeftSideCloseIcon
            title={t('common:notifications')}
            onPressLeft={() => {
              hideNotificationList();
            }}
          />
        </View>

        <FlatList
          data={mockData.NotificationListData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
};

export default NotificationScreen;
