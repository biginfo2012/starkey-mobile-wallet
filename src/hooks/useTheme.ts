import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import {
  ThemeVariables,
  Theme,
  ThemeNavigationTheme,
  ThemeNavigationColors,
} from '../../@types/theme';
import { ThemeState } from '../store/theme';
import {
  Common,
  Fonts,
  Gutters,
  Images,
  Layout,
  themes,
  DefaultVariables,
  Animations,
} from '../theme';

export default function () {
  // Get the scheme device
  const colorScheme = useColorScheme();

  const isDark = useSelector(
    (state: { theme: ThemeState }) => state.theme.darkMode,
  );
  const darkMode = isDark === null ? colorScheme === 'dark' : isDark;

  let variables = {};
  let partialTheme = {};
  let darkVariables = {};
  let partialDarkTheme = {};

  if (darkMode) {
    const { Variables, ...darkThemeConfig } =
      themes['default_dark' as keyof typeof themes] || {};

    darkVariables = Variables;
    partialDarkTheme = darkThemeConfig;
  }

  const themeVariables = mergeVariables(variables, darkVariables);

  const fonts = Fonts(themeVariables);
  const gutters = Gutters(themeVariables);
  const images = Images(themeVariables);
  const animations = Animations(themeVariables);
  const layout = Layout(themeVariables);
  const common = Common({
    ...themeVariables,
    Layout: Layout(themeVariables),
    Gutters: Gutters(themeVariables),
    Fonts: Fonts(themeVariables),
    Images: Images(themeVariables),
    Animations: Animations(themeVariables),
  });

  // Build the default theme
  const baseTheme: Theme<
    typeof fonts,
    typeof gutters,
    typeof images,
    typeof layout,
    typeof common,
    typeof animations
  > = {
    Fonts: fonts,
    Gutters: gutters,
    Images: images,
    Layout: layout,
    Common: common,
    Animations: animations,
    ...themeVariables,
  };

  // Merge and return the current Theme
  return buildTheme(
    darkMode,
    baseTheme,
    formatTheme(themeVariables, partialTheme || {}),
    formatTheme(themeVariables, partialDarkTheme || {}),
  );
}

/**
 * Generate Theme with theme variables
 */
const formatTheme = <F, G, I, L, C, A>(
  variables: ThemeVariables,
  theme: Partial<Theme<F, G, I, L, C, A>>,
) => {
  return Object.entries(theme).reduce((acc, [name, generate]) => {
    return {
      ...acc,
      [name]: (generate as any)(variables),
    };
  }, theme);
};

/**
 * Merge all variables for building the theme
 * baseTheme <- currentTheme <- currentDarkTheme
 */
const mergeVariables = (
  themeConfig: Partial<ThemeVariables>,
  darkThemeConfig: Partial<ThemeVariables>,
) => {
  return Object.entries(DefaultVariables).reduce((acc, [group, vars]) => {
    const theme:
      | Record<keyof typeof DefaultVariables, typeof vars>
      | undefined = (themeConfig as any)[group];
    const darkTheme:
      | Record<keyof typeof DefaultVariables, typeof vars>
      | undefined = (darkThemeConfig as any)[group];

    return {
      ...acc,
      [group]: {
        ...vars,
        ...(theme || {}),
        ...(darkTheme || {}),
      },
    };
  }, DefaultVariables);
};

/**
 * Provide all the theme exposed with useTheme()
 */
const buildTheme = <F, G, I, L, C, A>(
  darkMode: boolean,
  baseTheme: Theme<F, G, I, L, C, A>,
  themeConfig: Partial<Theme<F, G, I, L, C, A>>,
  darkThemeConfig: Partial<Theme<F, G, I, L, C, A>>,
) => {
  return {
    ...mergeTheme(baseTheme, themeConfig, darkThemeConfig),
    darkMode,
    NavigationTheme: mergeNavigationTheme(
      darkMode ? DarkTheme : DefaultTheme,
      baseTheme.NavigationColors,
    ),
  };
};

/**
 * Merge theme from baseTheme <- currentTheme <- currentDarkTheme
 */
const mergeTheme = <F, G, I, L, C, A>(
  baseTheme: Theme<F, G, I, L, C, A>,
  theme: Partial<Theme<F, G, I, L, C, A>>,
  darkTheme: Partial<Theme<F, G, I, L, C, A>>,
) =>
  Object.entries(baseTheme).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: {
        ...((value as any) || {}),
        ...((theme as any)[key] || {}),
        ...((darkTheme as any)[key] || {}),
      },
    }),
    baseTheme,
  ) as typeof baseTheme;

/**
 * Merge the React Navigation Theme
 *
 * @param reactNavigationTheme
 * @param overrideColors
 * @return {{colors}}
 */
const mergeNavigationTheme = (
  reactNavigationTheme: ThemeNavigationTheme,
  overrideColors: Partial<ThemeNavigationColors>,
) => ({
  ...reactNavigationTheme,
  colors: {
    ...reactNavigationTheme.colors,
    ...overrideColors,
  },
});
