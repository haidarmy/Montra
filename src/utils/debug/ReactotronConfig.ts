/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Reactotron, {overlay, trackGlobalErrors} from 'reactotron-react-native';

Reactotron.clear!();

Reactotron
  //   .setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({name: 'Montra'}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(overlay())
  .use(trackGlobalErrors({}))
  .connect(); // let's connect!
