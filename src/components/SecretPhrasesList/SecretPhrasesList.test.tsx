import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { SecretPhrasesList } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <SecretPhrasesList data={['test', 'test']} />
    </Provider>
  );
  render(component);
});
