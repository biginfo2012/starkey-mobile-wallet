import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';

import { TitleWithLeftImageView } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <TitleWithLeftImageView title={'test'} iconPath={Images.ic_BNB} />
    </Provider>
  );
  render(component);
});
