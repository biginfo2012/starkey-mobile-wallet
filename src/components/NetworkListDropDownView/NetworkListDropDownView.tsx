import React, { memo, useEffect, useState } from 'react';
import { Keyboard, Modal, TextInputProps, View } from 'react-native';

import { t } from 'i18next';
import mockData from 'theme/mockData';
import { SortingItem } from 'types/applicationInterfaces';

import {
  DropDownView,
  GestureHandlerHoc,
  SortByFilterBottomSheetView,
} from '..';
import { style } from './styles';

interface Props extends TextInputProps {
  selectedNetwork?: SortingItem;
  onSelectedNetwork?: (items: SortingItem) => void;
  backGroundColor?: string;
  filteredNetworkIds?: any[];
}

const NetworkListDropDownView = (props: Props) => {
  const { selectedNetwork, onSelectedNetwork, backGroundColor } = props;

  const [openChooseNetwork, setOpenChooseNetwork] = useState(false);
  const [networkList, setNetworkList] = useState([]);

  useEffect(() => {
    if (props?.filteredNetworkIds?.length) {
      setNetworkList(
        mockData.mainNetworkList.filter(item =>
          props?.filteredNetworkIds?.includes(item.shortName) ? true : false,
        ),
      );
    } else {
      setNetworkList(mockData.nativeNetworkList);
    }
  }, [props?.filteredNetworkIds]);

  return (
    <View>
      <DropDownView
        text={selectedNetwork?.text ?? t('onBoarding:choose_network')}
        onPress={() => {
          Keyboard.dismiss();
          setOpenChooseNetwork(true);
        }}
        backGroundColor={backGroundColor}
      />

      <Modal visible={openChooseNetwork} transparent={true}>
        <GestureHandlerHoc>
          <SortByFilterBottomSheetView
            multiSelect={false}
            title={t('onBoarding:select_network')}
            onDonePress={item => {
              setOpenChooseNetwork(false);
              onSelectedNetwork && onSelectedNetwork(item[0]);
            }}
            onClearPress={() => {
              onSelectedNetwork && onSelectedNetwork({});
            }}
            isSheetOpen={openChooseNetwork}
            items={networkList}
            onClose={() => {
              setOpenChooseNetwork(false);
            }}
            selectedItemsId={selectedNetwork?.id ? [selectedNetwork.id] : []}
            customImageStyle={style().icon}
            enablePanDownToClose={true}
          />
        </GestureHandlerHoc>
      </Modal>
    </View>
  );
};

NetworkListDropDownView.defaultProps = {
  backGroundColor: '',
  selectedNetwork: {},
  onSelectedNetwork: {},
  filteredNetworkIds: [],
};

export default memo(NetworkListDropDownView);
