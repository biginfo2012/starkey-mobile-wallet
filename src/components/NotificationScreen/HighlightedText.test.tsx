import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import HighlightedText from './HighlightedText';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <HighlightedText text={'test'} pattern={'[0-9]+ [A-Z]+|@[a-z0-9]+'} />
    </Provider>
  );
  render(component);
});
