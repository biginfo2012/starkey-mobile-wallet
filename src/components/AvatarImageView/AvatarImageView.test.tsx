import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';

import AvatarImageView from './AvatarImageView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <AvatarImageView
        imgIconPath={Images.ic_avatar}
        selectedImgIconPath={Images.ic_avatar}
        onPress={jest.fn}
      />
    </Provider>
  );

  render(component);
});
