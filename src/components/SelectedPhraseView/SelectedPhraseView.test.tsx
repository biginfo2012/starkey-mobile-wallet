import React from 'react';
import { Provider } from 'react-redux';

import { render, screen } from '@testing-library/react-native';
import { store } from 'store/index';
import { Colors } from 'theme/Variables';

import SelectedPhraseView from './SelectedPhraseView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <SelectedPhraseView
        text={'test'}
        borderColor={Colors.inputBackground}
        index={1}
        position={2}
      />
    </Provider>
  );
  render(component);

  const containerPhraseText = screen.getByTestId('phraseText');
  expect(containerPhraseText.props.children).not.toEqual(undefined);

  expect(component.props.children.props.borderColor).not.toEqual(undefined);

  expect(component.props.children.props.index).toBeGreaterThan(0);
});
