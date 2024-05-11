import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import Images from 'theme/Images';

import { RecoverySelectionCard } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <RecoverySelectionCard
        item={{
          id: 1,
          title: 'common:Files_recovery',
          tagText: 'common:Easy',
          description: 'common:Store_your_key_backups_in_3_different_locations',
          image: Images.ic_fileWithGradientBg,
        }}
      />
    </Provider>
  );
  render(component);
});
