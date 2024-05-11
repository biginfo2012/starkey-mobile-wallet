import React, { memo, useMemo, useState } from 'react';
import { View, ViewStyle } from 'react-native';

import useTheme from 'hooks/useTheme';
import { SortingItem } from 'types/applicationInterfaces';

import BottomSheetWrapper from '../BottomSheetWrapper/BottomSheetWrapper';
import SectionWiseSelectionListView from '../SectionWiseSelectionListView/SectionWiseSelectionListView';
import SelectionListView from '../SelectionListView/SelectionListView';
import { style } from './style';

interface Props {
  onChange: (index: number) => void;
  items: SortingItem[] | [{ title: string; data: SortingItem[] }]; // Update the type to match your actual item type
  isSheetOpen?: boolean;
  onClose: () => void;
  onDonePress: (items: SortingItem[]) => void;
  multiSelect: boolean;
  title: string;
  onClearPress: () => void;
  hasMultipleSections?: boolean;
  doneBtnText?: string;
  snapPointsVal?: string;
  showDefaultSection?: boolean;
  selectedItemsId?: string[];
  customImageStyle?: ViewStyle;
  enablePanDownToClose?: boolean;
}

const SortByFilterBottomSheetView = (props: Props): React.JSX.Element => {
  const { Colors, Layout, Common } = useTheme();

  const {
    onChange,
    items,
    isSheetOpen,
    onClose,
    onDonePress,
    multiSelect,
    title,
    onClearPress,
    hasMultipleSections,
    doneBtnText,
    snapPointsVal,
    showDefaultSection,
    selectedItemsId,
    customImageStyle,
    enablePanDownToClose,
  } = props;

  const [currentSelectedIds, setCurrentSelectedIds] = useState<string[]>(
    showDefaultSection ? ['1'] : selectedItemsId,
  );

  const snapPoints = useMemo(() => [snapPointsVal], []);

  return isSheetOpen ? (
    <View style={{ ...Layout.absoluteFill }}>
      <BottomSheetWrapper
        onClose={onClose}
        isSheetOpen={isSheetOpen}
        bottomSheetBgStyle={style(Colors).bottomSheetBg}
        bottomSheetStyle={Common.bottomSheet}
        snapPoints={snapPoints}
        onChange={onChange}
        handleIndicatorStyle={{ backgroundColor: Colors.gray }}
        enablePanDownToClose={
          enablePanDownToClose
            ? enablePanDownToClose
            : currentSelectedIds?.length === 0
        }
      >
        {hasMultipleSections ? (
          <SectionWiseSelectionListView
            onDonePress={onDonePress}
            items={items as [{ title: string; data: SortingItem[] }]}
            multiSelect={multiSelect}
            titleText={title}
            doneBtnText={doneBtnText}
            onFilterUpdate={itemIds => {
              setCurrentSelectedIds(itemIds);
            }}
            selectedItemsId={currentSelectedIds}
            onClearPress={onClearPress}
          />
        ) : (
          <SelectionListView
            selectedItemsId={currentSelectedIds}
            onDonePress={onDonePress}
            items={items as SortingItem[]}
            multiSelect={multiSelect}
            titleText={title}
            doneBtnText={doneBtnText}
            onFilterUpdate={itemIds => {
              setCurrentSelectedIds(itemIds);
            }}
            onClearPress={onClearPress}
            customImageStyle={customImageStyle}
          />
        )}
      </BottomSheetWrapper>
    </View>
  ) : (
    <></>
  );
};
SortByFilterBottomSheetView.defaultProps = {
  isSheetOpen: false,
  hasMultipleSections: false,
  doneBtnText: 'common:apply',
  snapPointsVal: '65%',
  showDefaultSection: false,
  selectedItemsId: [],
  customImageStyle: {},
  enablePanDownToClose: false,
};
export default memo(SortByFilterBottomSheetView);
