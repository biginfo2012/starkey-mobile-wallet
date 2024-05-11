import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { Button } from '..';
import BottomViewTitleAndSubTitle from './BottomViewTitleAndSubTitle';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <BottomViewTitleAndSubTitle
        title={'test'}
        subTitle={'test'}
        middleView={<Button text={'test'} onPress={jest.fn} />}
      />
    </Provider>
  );
  render(component);
});
