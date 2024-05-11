import React from 'react';
import { View, Text, Pressable, ViewStyle, TextStyle } from 'react-native';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';

import { style } from './styles';

type Props = {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  tabBarStyle?: ViewStyle;
  activeTabStyle: ViewStyle;
  activeTabTextStyle: TextStyle;
};

const TabBar = (props: Props) => {
  const {
    tabs,
    activeTab,
    setActiveTab,
    tabBarStyle,
    activeTabStyle,
    activeTabTextStyle,
  } = props;
  const { Colors, Layout, Fonts, Gutters } = useTheme();

  return (
    <View
      style={[style(Layout, Colors, Gutters).tabBarRootContainer, tabBarStyle]}
    >
      {tabs.map((tabText, index) => (
        <Pressable
          key={index}
          style={[
            style(Layout, Colors).tab,
            activeTab === index ? activeTabStyle : {},
          ]}
          onPress={() => setActiveTab(index)}
        >
          <Text
            style={[
              Fonts.textTinyBoldWhite,
              activeTab === index ? activeTabTextStyle : {},
            ]}
          >
            {t(tabs[index])}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
TabBar.defaultProps = {
  tabBarStyle: {},
};

export default TabBar;
