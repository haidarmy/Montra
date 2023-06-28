/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Reactotron from 'reactotron-react-native';
import {name as appName} from './app.json';
import App from './src/App';

AppRegistry.registerComponent(appName, () => (__DEV__ ? Reactotron.overlay(App) : App));

if (__DEV__) {
  import('./src/utils/debug/ReactotronConfig').then(() => console.log('Reactotron Configured'));
}
