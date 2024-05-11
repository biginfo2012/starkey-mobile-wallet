/**
 * This file defines the base application BorderRadius.
 */
import { StyleSheet } from 'react-native';

const BorderRadius = StyleSheet.create({
  LargeBorderRadius: { borderRadius: 40 },
  ExtraMediumBorderRadius: { borderRadius: 16 },
  ExtraRegularBorderRadius: { borderRadius: 18 },
  MediumBorderRadius: { borderRadius: 14 },
  RegularBorderRadius: { borderRadius: 12 },
  RegularBorderTopRadius: { borderTopEndRadius: 12, borderTopLeftRadius: 12 },
  RegularBorderBottomRadius: {
    borderBottomEndRadius: 12,
    borderBottomLeftRadius: 12,
  },
  LargeTopBorderRadius: { borderTopEndRadius: 40, borderTopLeftRadius: 40 },
});

export default BorderRadius;
