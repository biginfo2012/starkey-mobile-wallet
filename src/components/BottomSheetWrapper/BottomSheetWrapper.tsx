/* eslint-disable react/require-default-props */
import React, { memo, useEffect, useRef } from 'react';
import { ViewStyle } from 'react-native';

import BottomSheet from '@gorhom/bottom-sheet';

interface Props {
  bottomSheetBgStyle?: ViewStyle;
  bottomSheetStyle?: ViewStyle;
  snapPoints: any[];
  handleIndicatorStyle?: ViewStyle;
  isSheetOpen?: boolean;
  onClose: () => void;
  backgroundStyle?: ViewStyle;
  style?: ViewStyle;
  children?: React.ReactNode;
  onChange?: (index: number) => void;
  enablePanDownToClose?: boolean;
}

const BottomSheetWrapper = (props: Props): React.JSX.Element => {
  const sheetRef = useRef<BottomSheet>(null);
  const {
    bottomSheetBgStyle,
    bottomSheetStyle,
    snapPoints,
    handleIndicatorStyle,
    isSheetOpen,
    onChange,
    onClose,
    children,
    ...otherProps
  } = props;

  useEffect(() => {
    if (isSheetOpen) {
      openSheet();
    } else {
      dismissSheet();
    }
  }, [isSheetOpen]);

  const openSheet = () => {
    sheetRef?.current?.expand();
  };

  const dismissSheet = () => {
    sheetRef?.current?.close();
  };
  return (
    <BottomSheet
      backgroundStyle={bottomSheetBgStyle}
      style={bottomSheetStyle}
      ref={sheetRef}
      snapPoints={snapPoints}
      onChange={onChange}
      handleIndicatorStyle={
        handleIndicatorStyle
          ? handleIndicatorStyle
          : {
              backgroundColor: bottomSheetBgStyle?.backgroundColor,
            }
      }
      onClose={onClose}
      {...otherProps}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustPan"
    >
      {children}
    </BottomSheet>
  );
};
BottomSheetWrapper.defaultProps = {
  isSheetOpen: false,
};

export default memo(BottomSheetWrapper);
