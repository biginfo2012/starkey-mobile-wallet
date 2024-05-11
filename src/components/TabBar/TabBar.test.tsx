import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { TabBar } from '..';

test('render correctly', () => {
  const tabs = ['common:tab_types.search', 'common:tab_types.custom_tokens'];

  const component = (
    <Provider store={store}>
      <TabBar
        tabs={tabs}
        activeTab={0}
        setActiveTab={jest.fn}
        activeTabStyle={{}}
        activeTabTextStyle={{}}
      />
    </Provider>
  );
  render(component);
});
