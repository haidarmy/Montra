import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron, {
  networking,
  openInEditor,
  overlay,
  trackGlobalErrors,
} from 'reactotron-react-native';

namespace LogConfig {
  let isLogEnable = false;
  /**
   * Configure Reactotron and redirect console.log to Reactotron.log
   */
  export function configure(options: any = {}) {
    isLogEnable = options.enableLog ? options.enableLog : false;
    configureReactotron();
    connectConsoleToReactotron();
  }

  function configureReactotron() {
    Reactotron.setAsyncStorageHandler!(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
      .configure({name: 'Montra'}) // controls connection & communication settings
      .useReactNative() // add all built-in react native plugins
      .use(overlay())
      .use(
        networking({
          ignoreContentTypes: /^(image)\/.*$/i,
          ignoreUrls: /\/(logs|symbolicate)$/,
        }),
      )
      .use(
        trackGlobalErrors({
          veto: frame => frame.fileName.indexOf('/node_modules/react-native/') >= 0,
        }),
      )
      .connect();
    // clear log on start
    Reactotron.clear!();
  }

  function connectConsoleToReactotron() {
    console.info = info;
    console.log = log;
    console.warn = warn;
    console.error = error;
  }

  function log(message: string, ...args: any[]) {
    if (!isLogEnable) return;
    Reactotron.display({
      name: 'LOG',
      preview: message,
      value: {message, args},
    });
  }

  export function info(message: string, ...args: any[]) {
    if (!isLogEnable) return;
    Reactotron.display({
      name: 'INFO',
      preview: message,
      value: {message, args},
    });
  }

  export function warn(message: string, ...args: any[]) {
    if (!isLogEnable) return;
    Reactotron.display({
      name: 'WARN',
      preview: message,
      value: {message, args},
      important: true,
    });
  }

  export function error(message: string, ...args: any[]) {
    if (!isLogEnable) return;
    Reactotron.display({
      name: 'ERROR',
      preview: message,
      value: {message, args},
      important: true,
    });
  }
}

export default LogConfig;
