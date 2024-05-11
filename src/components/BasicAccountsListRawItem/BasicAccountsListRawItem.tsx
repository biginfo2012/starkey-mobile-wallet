import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import LinearGradient from 'react-native-linear-gradient';
import { scale } from 'react-native-size-scaling';

import { Menu, MenuItem } from 'components/customComponents/OptionMenu';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';

import { style } from './style';

type Props = {
  item: any;
  selectedId: any;
  onSelect: (id: string) => void;
  onPressMenu: (option: string) => void;
  isShowHideOption: boolean;
};

const BasicAccountsListRawItem = (props: Props) => {
  const { Gutters, Layout, Fonts, Colors, Images } = useTheme();

  const { item, selectedId, onSelect, onPressMenu, isShowHideOption } = props;

  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  return (
    <View style={style(Gutters, Layout, Colors).rawRootContainer}>
      {item?.profileIcon ? (
        typeof item?.profileIcon === 'object' ? (
          <LinearGradient
            colors={
              typeof item?.profileIcon === 'object' ? item?.profileIcon : []
            }
            useAngle={true}
            angle={200}
            style={style(Gutters, Layout).icon}
          />
        ) : (
          <Image
            style={style(Gutters, Layout).icon}
            resizeMode="contain"
            source={
              typeof item?.profileIcon === 'object'
                ? null
                : typeof item?.profileIcon === 'string'
                ? { uri: item?.profileIcon }
                : item?.profileIcon
            }
          />
        )
      ) : (
        <View style={style(Gutters, Layout, Colors).textImage}>
          <Text style={[Fonts.titleSmall, { color: Colors.blackGray }]}>
            {`${item?.userName?.split(' ')[0][0]}`}
          </Text>
        </View>
      )}

      <View style={style(Gutters, Layout).subView}>
        <Text style={Fonts.titleSmall} numberOfLines={1}>
          {item?.userName}
        </Text>
      </View>
      <View style={style(Gutters, Layout).checkBox}>
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity
              style={style(Gutters, Layout, Colors).menuBtn}
              onPress={showMenu}
              testID="option-menu"
              hitSlop={{ top: 30, bottom: 30, left: 30 }}
            >
              <Image
                style={style(Gutters, Layout, Colors).menuIcon}
                source={Images.ic_option_menu_horizontal}
                resizeMode="contain"
              />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
          style={style(Gutters, Layout, Colors).menuView}
        >
          <MenuItem
            onPress={() => {
              hideMenu();
              onPressMenu(t('setting:edit'));
            }}
            text={t('setting:edit')}
            iconPath={Images.ic_edit_pen}
            isShowBorder={true}
          />
          <MenuItem
            onPress={() => {
              hideMenu();
              onPressMenu(t('setting:show_private_key'));
            }}
            text={t('setting:show_private_key')}
            iconPath={Images.ic_show_private_key}
            isShowBorder={true}
          />
          {isShowHideOption && (
            <MenuItem
              onPress={() => {
                hideMenu();
                onPressMenu(t('setting:Hide'));
              }}
              text={t('setting:Hide')}
              iconPath={Images.ic_eye_off}
            />
          )}
        </Menu>

        <BouncyCheckbox
          testID="bouncy-checkbox"
          isChecked={selectedId === item.userId}
          disableBuiltInState
          iconImageStyle={{ tintColor: Colors.blackGray }}
          fillColor={Colors.textPurple}
          innerIconStyle={{ borderColor: Colors.white }}
          size={scale(18)}
          onPress={() => onSelect(item.id)}
          hitSlop={{ top: 30, bottom: 30, right: 30 }}
        />
      </View>
    </View>
  );
};

export default BasicAccountsListRawItem;
