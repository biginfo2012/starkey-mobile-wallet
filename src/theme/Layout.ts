import { ThemeVariables } from '../../@types/theme';
import getStyleSheet from './Helper/currentStyleSheet';

export default function ({}: ThemeVariables) {
  return getStyleSheet().create({
    /* Column Layouts */
    col: {
      flexDirection: 'column',
    },
    colReverse: {
      flexDirection: 'column-reverse',
    },
    colCenter: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    colVCenter: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    colHCenter: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    /* Row Layouts */
    row: {
      flexDirection: 'row',
    },
    rowReverse: {
      flexDirection: 'row-reverse',
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowVCenter: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    rowHCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    /* Default Layouts */
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    alignItemsCenter: {
      alignItems: 'center',
    },
    alignItemsStart: {
      alignItems: 'flex-start',
    },
    alignItemsStretch: {
      alignItems: 'stretch',
    },
    alignItemsEnd: {
      alignItems: 'flex-end',
    },
    justifyContentCenter: {
      justifyContent: 'center',
    },
    justifyContentAround: {
      justifyContent: 'space-around',
    },
    justifyContentBetween: {
      justifyContent: 'space-between',
    },
    justifyContentEnd: {
      justifyContent: 'flex-end',
    },
    scrollSpaceAround: {
      flexGrow: 1,
      justifyContent: 'space-around',
    },
    scrollSpaceBetween: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    selfStretch: {
      alignSelf: 'stretch',
    },
    /* Sizes Layouts */
    fill: {
      flex: 1,
    },
    fillShrink: {
      flex: -1,
    },
    fullSize: {
      height: '100%',
      width: '100%',
    },
    fullWidth: {
      width: '100%',
    },
    halfWidth: {
      width: '50%',
    },
    fullHeight: {
      height: '100%',
    },
    /* Operation Layout */
    mirror: {
      transform: [{ scaleX: -1 }],
    },
    rotate90: {
      transform: [{ rotate: '90deg' }],
    },
    rotate90Inverse: {
      transform: [{ rotate: '-90deg' }],
    },
    // Position
    relative: {
      position: 'relative',
    },
    absolute: {
      position: 'absolute',
    },
    absoluteFill: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    top0: {
      top: 0,
    },
    bottom0: {
      bottom: 0,
    },
    left0: {
      left: 0,
    },
    right0: {
      right: 0,
    },
    textAlignCenter: {
      textAlign: 'center',
    },
    textAlignRight: {
      textAlign: 'right',
    },
    displayNone: {
      display: 'none',
    },
  });
}
