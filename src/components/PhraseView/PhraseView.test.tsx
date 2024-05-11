import React from 'react';
import { Provider } from 'react-redux';

import { render, screen } from '@testing-library/react-native';
import { store } from 'store/index';

import PhraseView from './PhraseView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <PhraseView text={'test'} isDisabled={false} onPress={jest.fn} />
    </Provider>
  );
  render(component);

  const container = screen.getByTestId('phraseText');
  expect(container.props.children).not.toEqual(undefined);
});
