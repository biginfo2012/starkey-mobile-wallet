import React from 'react';
import { useSelector } from 'react-redux';

import { useRoute } from '@react-navigation/native';
import { FlatListWithTitle, SafeAreaWrapper } from 'components/index';
import { RootState } from 'store/index';
import mockData from 'theme/mockData';

const Currency: React.FC<any> = () => {
  const { title } = useRoute().params as any;

  const currency = useSelector(
    (state: RootState) => state.userInfo.data.config.currency,
  );

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <FlatListWithTitle
        title={title}
        flatListData={mockData.CurrencyListData}
        selectedItem={currency}
      />
    </SafeAreaWrapper>
  );
};

export default Currency;
