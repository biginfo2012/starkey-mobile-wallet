import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { t } from 'i18next';
import { store } from 'store/index';

import FromDeviceView from './FromDeviceView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <FromDeviceView
        title={t('onBoarding:from_device')}
        buttonName={t('onBoarding:import')}
        onPress={jest.fn}
      />
    </Provider>
  );
  render(component);
});

describe('FromDeviceView', () => {
  const mockProps = {
    buttonName: 'Submit',
    onPress: jest.fn(),
    title: 'Title',
    subTitle: 'Subtitle',
    filePath: [{ name: 'file1.txt', fileStatus: 'success' }],
    onPressClose: jest.fn(),
    shouldShowUserCloudID: false,
    shouldShowError: false,
  };

  it('renders correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <FromDeviceView {...mockProps} />
      </Provider>,
    );

    const titleText = getByText('Title');
    const subtitleText = getByText('Subtitle');

    expect(titleText).toBeTruthy();
    expect(subtitleText).toBeTruthy();

    mockProps.filePath.forEach(({ name }) => {
      const filePathText = getByText(name);
      expect(filePathText).toBeTruthy();
    });
  });
});
