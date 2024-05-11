/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
// const { getDefaultConfig } = require('metro-config');

// module.exports = (async () => {
// const {
//   resolver: { sourceExts, assetExts },
// } = await getDefaultConfig();
//   return {
//     transformer: {
//       experimentalImportSupport: false,
//       inlineRequires: true,
//       babelTransformerPath: require.resolve('react-native-svg-transformer'),
//     },
//     resolver: {
//       assetExts: assetExts.filter(ext => ext !== 'svg'),
//       sourceExts: [...sourceExts, 'svg'],
//     },
//   };
// })();

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const {
  createSentryMetroSerializer,
} = require('@sentry/react-native/dist/js/tools/sentryMetroSerializer');

const {
  resolver: { sourceExts, assetExts },
} = getDefaultConfig();
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    experimentalImportSupport: false,
    inlineRequires: true,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },

  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },

  serializer: {
    customSerializer: createSentryMetroSerializer(),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
