/** @type {import('ts-jest').JestConfigWithTsJest} */
const plugins = [
  [
    'module-resolver',
    {
      alias: {
        screens: './src/screens',
        components: './src/components',
        theme: './src/theme/',
        hooks: './src/hooks/',
        services: './src/services/',
        customHooks: './src/customHooks/',
        store: './src/store/',
        algorithms: './src/algorithms/',
        nativeBridge: './src/nativeBridge/',
        stream: 'stream-browserify',
        crypto: 'react-native-quick-crypto',
        buffer: '@craftzdog/react-native-buffer',
      },
    },
  ],
  'inline-dotenv',
  '@babel/plugin-transform-flow-strip-types',
  ['@babel/plugin-proposal-private-methods', { loose: true }],
  ['@babel/plugin-proposal-class-properties', { loose: true }],
  ['react-native-reanimated/plugin'],
];

if (process.env['BABEL_ENV'] !== 'development') {
  plugins.push(['transform-remove-console']);
}

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: plugins,
};
