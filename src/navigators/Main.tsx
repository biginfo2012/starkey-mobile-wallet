import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store/index';

import PostLoginNavigator from './PostLogin';
import PreLoginNavigator from './PreLogin';

const MainNavigator = () => {
  const userInfo = useSelector((state: RootState) => {
    return state.userInfo.data;
  });
  if (userInfo?.token) {
    return <PostLoginNavigator />;
  } else {
    return <PreLoginNavigator />;
  }
};

export default MainNavigator;
