import React, { useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  HorizontalSeparatorView,
  SafeAreaWrapper,
  BasicAccountsListRawItem,
  BasicAccountsOptionsRawItem,
  HeaderTitleWithLeftSideCloseIcon,
} from 'components/index';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import nextFrame from 'next-frame';
import StoreUpdateReduxWalletStateService from 'services/StoreUpdateReduxWalletStateService';
import WalletCommonService from 'services/WalletCommonService';
import { AppDispatch, RootState } from 'store/index';
import { updateCurrentUser, updateCurrentUserId } from 'store/userInfo';
import { updateCurrentUserNetworkList } from 'store/wallet';
import { showConfirmationModal, showToast } from 'theme/Helper/common/Function';
import { defaultNetwork } from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import mockData from 'theme/mockData';
import ScreenNames from 'theme/screenNames';
import { PopUpItem } from 'types/applicationInterfaces';

import { style } from './style';

const Accounts = () => {
  const { Common, Colors, Fonts, Images } = useTheme();

  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();

  const userInfo = useSelector((state: RootState) => {
    return {
      currentUserId: state.userInfo.data.currentUserId,
      usersData: state.userInfo.data.usersData,
      importedUsersData: state.userInfo.data.importedUsersData,
    };
  }, shallowEqual);

  const seedPhrase = useSelector((state: RootState) => {
    return state.wallet.data.seedPhrase;
  });

  const isWalletFromSeedPhase = useSelector((state: RootState) => {
    return state.wallet.data.isWalletFromSeedPhase;
  });

  const [hideUser, setHideUser] = useState('');

  /**
   * Define a function callOk which is intended to be executed when the user confirms hiding the account
   * Define a function onPressCancel which is intended to be executed when the user cancels hiding the account
   * Define an object popUpLogOutObj that holds properties for a pop-up confirmation dialog
   */
  const callOk = () => {
    showToast('info', t('common:the_account_is_hidden'));
    StoreUpdateReduxWalletStateService().hideUserAccount(hideUser);
  };

  const onPressCancel = () => {
    setHideUser('');
  };

  const popUpLogOutObj = {
    isVisible: true,
    popupTitle: t('setting:backup_the_private_key_before_hiding_the_account'),
    popupDescription: t(
      'setting:if_you_want_to_import_it_later_you_will_need_the_private_key',
    ),
    buttonOkText: t('common:Hide_Now'),
    okButtonType: 'destructive',
    buttonCancelText: t('common:cancel'),
    onPressOk: callOk,
    onPressCancel: onPressCancel,
    iconPath: Images.ic_cancel_transaction,
  } as PopUpItem;

  useUpdateEffect(() => {
    if (isFocused) {
      updateCurrentNetwork();
    }
  }, [userInfo.currentUserId]);

  const updateCurrentNetwork = async () => {
    WalletCommonService().resetAllWallet();
    await nextFrame();
    dispatch(updateCurrentUserNetworkList({ userId: userInfo.currentUserId }));
  };

  useUpdateEffect(() => {
    if (hideUser) {
      setTimeout(() => {
        showConfirmationModal(popUpLogOutObj);
      }, 333);
    }
  }, [hideUser]);

  const renderAccountItem = ({ item }): React.JSX.Element => {
    return (
      <BasicAccountsListRawItem
        item={item}
        selectedId={userInfo.currentUserId}
        onSelect={async () => {
          if (item.userId !== userInfo.currentUserId) {
            dispatch(
              updateCurrentUserId({
                data: { userId: item.userId },
              }),
            );
            await nextFrame();
            dispatch(updateCurrentUser({ data: item }));
          }
        }}
        onPressMenu={option => {
          if (option === t('setting:edit')) {
            navigation.navigate(ScreenNames.CreateEditImportAccount, {
              title: t('common:Edit_account_title'),
              subTitle: '',
              btnText: t('common:Save'),
              shouldShowBackIcon: true,
              redirectFrom: t('common:screen_types.editAccount'),
              seedPhraseOrPrivateKey: item?.isWalletFromSeedPhase
                ? seedPhrase
                : item?.privateKey,
              selectedNetwork: defaultNetwork,
              userData: item,
            });
          } else if (option === t('setting:Hide')) {
            setHideUser(item.userId);
          } else if (option === t('setting:show_private_key')) {
            navigation.navigate(ScreenNames.SecretRecoveryPhrase, {
              redirectFrom: ScreenNames.Accounts,
              userData: item,
            });
          }
        }}
        isShowHideOption={!item?.isPrimary}
      />
    );
  };

  const renderAccountsOptionsItem = ({ item }): React.JSX.Element => {
    return (
      <BasicAccountsOptionsRawItem
        item={item}
        onPress={() => {
          if (item?.redirect) {
            if (item?.id === 1) {
              navigation.navigate(item?.redirect, {
                title: t('common:create_sub_account_title'),
                subTitle: '',
                btnText: t('wallet:create'),
                shouldShowBackIcon: true,
                redirectFrom: t('common:screen_types.createSubAccount'),
                seedPhraseOrPrivateKey: seedPhrase,
                selectedNetwork: defaultNetwork,
                userData: {},
              });
            } else {
              navigation.navigate(ScreenNames.ImportWallet, {
                redirectFrom: t('setting:by_import_sub_account_private_key'),
              });
            }
          }
        }}
      />
    );
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderTitleWithLeftSideCloseIcon
          title={t('common:accounts')}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={userInfo.usersData}
            keyExtractor={item => item.userId}
            renderItem={renderAccountItem}
            scrollEnabled={false}
            contentContainerStyle={style(Colors).flatListBG}
          />
          {userInfo.importedUsersData.length !== 0 && (
            <>
              <HorizontalSeparatorView
                spacing={Variables.MetricsSizes.medium}
              />
              <Text style={Fonts.textSmallTinyGrayOpacityRegular}>
                {t('common:imported_account')}
              </Text>
              <HorizontalSeparatorView spacing={Variables.MetricsSizes.tiny} />
              <FlatList
                data={userInfo.importedUsersData}
                keyExtractor={item => item.userId}
                renderItem={renderAccountItem}
                scrollEnabled={false}
                contentContainerStyle={style(Colors).flatListBG}
              />
            </>
          )}
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
          <FlatList
            data={
              isWalletFromSeedPhase
                ? [
                    ...mockData.CreateSubAccountsOption,
                    ...mockData.ImportAccountsOption,
                  ]
                : mockData.ImportAccountsOption
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderAccountsOptionsItem}
            scrollEnabled={false}
            contentContainerStyle={style(Colors).flatListBG}
          />
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default Accounts;
