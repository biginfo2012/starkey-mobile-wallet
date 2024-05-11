/**
 * @format
 */
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

// Pull in the shims (BEFORE importing ethers)
import '@ethersproject/shims';
import 'text-encoding-polyfill';

import { name as appName } from './app.json';
import App from './src/App';

// Import the ethers library
global.Buffer = require('@craftzdog/react-native-buffer').Buffer;
AppRegistry.registerComponent(appName, () => App);
