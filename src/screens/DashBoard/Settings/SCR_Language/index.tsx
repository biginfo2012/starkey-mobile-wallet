import React from 'react';
import { useSelector } from 'react-redux';

import { useRoute } from '@react-navigation/native';
import { FlatListWithTitle, SafeAreaWrapper } from 'components/index';
import { RootState } from 'store/index';
import mockData from 'theme/mockData';

const Language: React.FC<any> = () => {
  const { title } = useRoute().params as any;

  const language = useSelector(
    (state: RootState) => state.userInfo.data.config.language,
  );

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <FlatListWithTitle
        title={title}
        flatListData={mockData.LanguageListData}
        selectedItem={language}
      />
    </SafeAreaWrapper>
  );
};

export default Language;
