import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import useTheme from 'hooks/useTheme';

type Props = {
  children: JSX.Element | JSX.Element[];
  applyToOnlyTopEdge?: boolean;
};

export default function SafeAreaWrapper({
  children,
  applyToOnlyTopEdge,
}: Props) {
  const { Common } = useTheme();

  return (
    <SafeAreaView
      edges={applyToOnlyTopEdge ? ['top'] : ['top', 'bottom', 'left', 'right']}
      style={Common.container}
    >
      {children}
    </SafeAreaView>
  );
}

SafeAreaWrapper.defaultProps = {
  applyToOnlyTopEdge: true,
};
