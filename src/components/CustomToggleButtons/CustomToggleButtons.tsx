import React, { memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import useTheme from 'hooks/useTheme';

import { style } from './styles';

type Props = {
  toggleList: string[];
  selectedType: number;
  setSelectedType: (arg0: number) => void;
  toggleType: string;
};

const CustomToggleButtons = ({
  selectedType,
  setSelectedType,
  toggleList,
  toggleType,
}: Props) => {
  const { Layout, Colors, Fonts } = useTheme();

  const handleToggleSwitch = (index: number) => {
    if (index !== selectedType) {
      setSelectedType(selectedType === 0 ? 1 : 0);
    }
  };

  return toggleType === 'image' ? (
    <View style={[style(Layout, Colors).containerImage]}>
      {toggleList.map((item, index) => (
        <TouchableOpacity
          key={Math.random() + index}
          onPress={() => {
            handleToggleSwitch(index);
          }}
          style={
            selectedType === index
              ? style(Layout, Colors).toggleSelected
              : style(Layout, Colors).toggle
          }
        >
          <Image
            style={[
              style(Layout, Colors).icon,
              {
                tintColor:
                  selectedType === index
                    ? Colors.inputBackground
                    : Colors.white,
              },
            ]}
            source={item}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ))}
    </View>
  ) : (
    <View style={[style(Layout, Colors).container]}>
      {toggleList.map((item, index) => (
        <TouchableOpacity
          key={item + index}
          onPress={() => {
            handleToggleSwitch(index);
          }}
          style={
            selectedType === index
              ? style(Layout, Colors).toggleSelected
              : style(Layout, Colors).toggle
          }
        >
          <Text
            style={[
              Fonts.titleSmall,
              {
                color:
                  selectedType === index
                    ? Colors.inputBackground
                    : Colors.white,
              },
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default memo(CustomToggleButtons);
