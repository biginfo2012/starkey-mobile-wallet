import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { MaxSlippageBottomSheetView } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <MaxSlippageBottomSheetView
        title={'test'}
        onDonePress={jest.fn}
        isSheetOpen={true}
        onClose={jest.fn}
        doneBtnText={'apply'}
      />
    </Provider>
  );
  render(component);
});
