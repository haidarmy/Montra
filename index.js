/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

if (__DEV__) {
  import('./src/utils/debug/ReactotronConfig').then(() => console.log('Reactotron Configured'));
}
