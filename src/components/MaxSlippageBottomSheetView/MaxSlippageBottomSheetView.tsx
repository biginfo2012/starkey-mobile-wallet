/* eslint-disable react-native/no-inline-styles */
import React, { memo, useMemo, useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { scale } from 'react-native-size-scaling';

import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';

import BottomSheetWrapper from '../BottomSheetWrapper/BottomSheetWrapper';
import { style } from './style';

interface Props {
  isSheetOpen?: boolean;
  onClose: () => void;
  onDonePress: () => void;
  title: string;
  doneBtnText: string;
}

const MaxSlippageBottomSheetView = (props: Props): React.JSX.Element => {
  const { Colors, Gutters, Layout, Common, Fonts } = useTheme();

  const snapPoints = useMemo(() => ['35%'], []);
  const { isSheetOpen, onClose, onDonePress, title, doneBtnText } = props;

  const [lowSlippageActive, setLowSlippageActive] = useState(false);
  const [mediumSlippageActive, setMediumSlippageActive] = useState(false);
  const [highSlippageActive, setHighSlippageActive] = useState(false);
  const [cutsomSlippageActive, setCutsomSlippageActive] = useState(true);
  const [isDoneButtonEnabled] = useState(false);

  const handleButtonClick = slippageText => {
    switch (slippageText) {
      case 'low':
        setLowSlippageActive(!lowSlippageActive);
        setMediumSlippageActive(false);
        setHighSlippageActive(false);
        setCutsomSlippageActive(!cutsomSlippageActive);
        break;

      case 'medium':
        setLowSlippageActive(false);
        setMediumSlippageActive(!mediumSlippageActive);
        setHighSlippageActive(false);
        setCutsomSlippageActive(!cutsomSlippageActive);
        break;

      case 'high':
        setLowSlippageActive(false);
        setMediumSlippageActive(false);
        setHighSlippageActive(!highSlippageActive);
        setCutsomSlippageActive(!cutsomSlippageActive);
        break;

      case 'cutsom':
        setCutsomSlippageActive(true);
        setLowSlippageActive(false);
        setMediumSlippageActive(false);
        setHighSlippageActive(false);

        break;

      default:
        break;
    }
  };

  return isSheetOpen ? (
    <View style={{ ...Layout.absoluteFill, zIndex: 100 }}>
      <BottomSheetWrapper
        onClose={onClose}
        isSheetOpen={isSheetOpen}
        bottomSheetBgStyle={style(Gutters, Layout, Colors).bottomSheetBg}
        bottomSheetStyle={Common.bottomSheet}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: Colors.gray }}
        enablePanDownToClose={true}
      >
        <View style={{ ...Layout.row, ...Gutters.regularBMargin }}>
          <TouchableOpacity style={{ width: scale(50) }}>
            <Text style={Fonts.textSmallBold}>{''}</Text>
          </TouchableOpacity>

          <Text
            style={[
              Fonts.textRegularBold,
              style(Gutters, Layout, Colors, Fonts).titleText,
            ]}
          >
            {title}
          </Text>
          <TouchableOpacity
            disabled={!isDoneButtonEnabled}
            onPress={onDonePress}
            style={{
              opacity: isDoneButtonEnabled ? 1 : 0.5,
              width: scale(50),
            }}
          >
            <Text style={Fonts.textSmallBold}>{doneBtnText}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[Fonts.textTinyDescriptionBold, Gutters.smallHPadding]}>
          {t('swap:max_slippage_desc')}
        </Text>

        <View style={style(Gutters, Layout).bottomButtonContainer}>
          {/* 0.1% Button */}
          <Pressable
            style={[
              style(Gutters, Layout).button,
              {
                backgroundColor: lowSlippageActive
                  ? Colors.textPurple
                  : applyOpacityToHexColor(Colors.textPurple, 0.15),
              },
            ]}
            onPress={() => handleButtonClick('low')}
          >
            <Text
              style={[
                Fonts.textSmallBold,
                {
                  color: lowSlippageActive
                    ? Colors.textGray800
                    : Colors.textPurple,
                },
              ]}
            >
              {'0.1%'}
            </Text>
          </Pressable>
          {/* 0.5% Button */}
          <Pressable
            style={[
              style(Gutters, Layout).button,
              Gutters.tinyHMargin,
              {
                backgroundColor: mediumSlippageActive
                  ? Colors.textPurple
                  : applyOpacityToHexColor(Colors.textPurple, 0.15),
              },
            ]}
            onPress={() => handleButtonClick('medium')}
          >
            <Text
              style={[
                Fonts.textSmallBold,
                {
                  color: mediumSlippageActive
                    ? Colors.textGray800
                    : Colors.textPurple,
                },
              ]}
            >
              {'0.5%'}
            </Text>
          </Pressable>
          {/* 1% Button */}
          <Pressable
            style={[
              style(Gutters, Layout).button,
              {
                backgroundColor: highSlippageActive
                  ? Colors.textPurple
                  : applyOpacityToHexColor(Colors.textPurple, 0.15),
              },
            ]}
            onPress={() => handleButtonClick('high')}
          >
            <Text
              style={[
                Fonts.textSmallBold,
                {
                  color: highSlippageActive
                    ? Colors.textGray800
                    : Colors.textPurple,
                },
              ]}
            >
              {'1%'}
            </Text>
          </Pressable>
          {/* Custome Button */}
          <View style={style(Gutters, Layout, Colors).customContainer}>
            <BottomSheetTextInput
              placeholder="Custom"
              placeholderTextColor={applyOpacityToHexColor(
                Colors.textGray600,
                0.6,
              )}
              style={[
                Gutters.smallLPadding,
                {
                  width: '80%',
                  color: Colors.textGray600,
                },
              ]}
              editable={cutsomSlippageActive}
              onChangeText={() => {
                handleButtonClick('cutsom');
              }}
              keyboardType="decimal-pad"
            />
            <Text style={Fonts.textSmallTinyGrayOpacityRegular}>{'%'}</Text>
          </View>
        </View>
      </BottomSheetWrapper>
    </View>
  ) : (
    <></>
  );
};
MaxSlippageBottomSheetView.defaultProps = {
  isSheetOpen: false,
};
export default memo(MaxSlippageBottomSheetView);
