import React, { memo } from 'react';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const GestureHandlerHoc = gestureHandlerRootHOC(props => {
  return <>{props.children}</>;
});

export default memo(GestureHandlerHoc);
