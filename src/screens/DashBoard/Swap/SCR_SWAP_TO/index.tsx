import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  SafeAreaWrapper,
  SwapFromToWithTitleSearchAndFlatList,
} from 'components/index';
import { t } from 'i18next';
import mockData from 'theme/mockData';

const SwapTo = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [selectedId, setSelectedId] = useState(null);

  const toggleCheckBox = itemId => {
    setSelectedId(prevSelectedItem => {
      return prevSelectedItem === itemId ? null : itemId;
    });
  };

  return (
    <SafeAreaWrapper>
      <SwapFromToWithTitleSearchAndFlatList
        handleBackPress={() => {
          navigation.goBack();
        }}
        title={t('swap:swapTo')}
        flatListData={mockData.SwapFromToTokenListData}
        selectedId={selectedId}
        handleOnPress={item => toggleCheckBox(item.id)}
      />
    </SafeAreaWrapper>
  );
};

export default SwapTo;
