/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/App';
import reactotron from 'reactotron-react-native';
import LogConfig from './ReactotronConfig';

AppRegistry.registerComponent(appName, () => (__DEV__ ? reactotron.overlay(App) : App));

if (__DEV__) {
  LogConfig.configure({enableLog: true});
}
