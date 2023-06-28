/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Reactotron from 'reactotron-react-native';

export function debug(value: any) {
  Reactotron.log!(value);
}
