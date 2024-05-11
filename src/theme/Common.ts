/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import { CommonParams } from '../../@types/theme';
import getStyleSheet from './Helper/currentStyleSheet';
import { NavigationColors } from './Variables';

export default function <C>({ Layout, Gutters }: CommonParams<C>) {
  return getStyleSheet().create({
    container: { ...Layout.fill },
    containerFillWithSmallHPadding: {
      ...Layout.fill,
      ...Gutters.smallHPadding,
    },
    textInput: {
      ...Layout.fill,
      ...{
        paddingVertical: 0,
      },
    },
    tabBarStyle: {
      display: 'flex',
      backgroundColor: NavigationColors.background,
    },
    bottomSheet: {
      ...Gutters.smallHPadding,
      ...Gutters.tinyTPadding,
    },
    smallHPadding: { ...Gutters.smallHPadding },
  });
}
