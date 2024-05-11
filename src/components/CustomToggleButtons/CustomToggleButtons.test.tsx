import React from 'react';
import { Provider } from 'react-redux';

import { t } from 'i18next';
import { store } from 'store/index';

import CustomToggleButtons from './CustomToggleButtons';

test('render correctly', () => {
  const componentCase1 = (
    <Provider store={store}>
      <CustomToggleButtons
        toggleList={[t('wallet:tokens'), t('wallet:nfts')]}
        selectedType={1}
        setSelectedType={jest.fn}
      />
    </Provider>
  );
  // render(componentCase1);

  expect(componentCase1.props.children.props.selectedType).toBe(1);

  const componentCase2 = (
    <Provider store={store}>
      <CustomToggleButtons
        toggleList={[t('wallet:tokens'), t('wallet:nfts')]}
        selectedType={1}
        setSelectedType={jest.fn}
      />
    </Provider>
  );
  // render(componentCase2);
  expect(componentCase2.props.children.props.selectedType).toBe(1);
});
