/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */
import { ThemeNavigationColors } from '../../@types/theme';
import { applyOpacityToHexColor } from './Helper/ColorUtils';

/**
 * Colors
 */
export const Colors = {
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#1C1C1E',
  white: '#ffffff',
  buttonBorderColor: '#EBEBF5',
  gray: '#787880',
  grayText: '#EBEBF599',
  background: '#2c2d3c',
  //Typography
  textWhite: '#ffffff',
  textGray800: '#000000',
  textGray400: '#4D4D4D',
  textGray200: '#A1A1A1',
  primary: '#8927C6',
  textSuccess: '#30D158',
  textError: '#FF453A',
  textPurple: '#DA8FFF',
  textGray600: '#EBEBF5',
  //ComponentColors
  circleButtonBackground: '#E1E1EF',
  circleButtonColor: '#44427D',
  switchBGColor: '#787880',
  placeholderColor: '#EBEBF5',
  blackGray: '#2C2C2E',
  border: '#545458',
  darkPink: '#F63190',
  primaryGradientColor: ['#F63190', '#C76AF5', '#8927C6'],
  primaryReversGradientColor: ['#44427D', '#F63190', '#DA8FFF'],
  bottomButtonBG: '#767680',
  buttonGrayText: '#EBEBF54D',
  bgError: '#FF6161',
  disableGradientColor: [
    applyOpacityToHexColor('#787880', 0.3),
    applyOpacityToHexColor('#787880', 0.3),
  ],
  switchGradientColor: ['#F63190', '#8927C6', '#95CEE7'],
};

export const NavigationColors: Partial<ThemeNavigationColors> = {
  primary: Colors.primary,
  background: '#2c2d3c',
  card: '#EFEFEF',
  border: '#545458',
};

/**
 * FontSize
 */
export const FontSize = {
  extraTiny: 11,
  smallTiny: 12,
  tiny: 13,
  small: 15,
  smallRegular: 16,
  regular: 17,
  smallMedium: 20,
  mediumMedium: 22,
  medium: 28,
  large: 34,
  extraLarge: 36,
};

const fontFamilyName = 'Mulish';

const fontFamily = {
  Black: `${fontFamilyName}-Black`,
  BlackItalic: `${fontFamilyName}-BlackItalic`,
  Bold: `${fontFamilyName}-Bold`,
  ExtraBold: `${fontFamilyName}-ExtraBold`,
  BoldItalic: `${fontFamilyName}-BoldItalic`,
  Italic: `${fontFamilyName}-Italic`,
  Light: `${fontFamilyName}-Light`,
  LightItalic: `${fontFamilyName}-LightItalic`,
  Medium: `${fontFamilyName}-Medium`,
  Regular: `${fontFamilyName}-Regular`,
  SemiBold: `${fontFamilyName}-SemiBold`,
};

/**
 * Metrics Sizes
 */
const tooExtraTiny = 2;
const extraTiny = 4;
const tiny = 8;
const tiny9 = 9;
const tinyMedium = 12;
const tinySmall = 14;
const small = tiny * 2; // 16
const smallRegular = 18; // 18
const regular = tiny * 3; // 24
const medium = tiny * 4; // 32
const semiLarge = tiny * 5; // 40
const large = regular * 2; // 48
export const MetricsSizes = {
  tooExtraTiny,
  extraTiny,
  tinyMedium,
  tiny,
  small,
  smallRegular,
  regular,
  large,
  tinySmall,
  medium,
  semiLarge,
  tiny9,
};

export default {
  Colors,
  NavigationColors,
  FontSize,
  MetricsSizes,
  fontFamily,
};
