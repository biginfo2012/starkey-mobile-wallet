import React from 'react';
import { Provider } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import VideoPlayer from './VideoPlayer';

test('render correctly', () => {
  const component = (
    <NavigationContainer>
      <Provider store={store}>
        <VideoPlayer
          videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          isVideoPaused={true}
          shouldShowVideoBtn={true}
          setShouldShowVideoBtn={jest.fn}
        />
      </Provider>
    </NavigationContainer>
  );
  render(component);

  expect(component.props.children.props.children.props.videoUrl).not.toEqual(
    undefined,
  );
});
