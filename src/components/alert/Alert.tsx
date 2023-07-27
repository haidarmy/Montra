import {StatusBar} from 'react-native';
import {showMessage} from 'react-native-flash-message';

export const Success = (message: string) => {
  showMessage({
    statusBarHeight: StatusBar.currentHeight,
    message,
    type: 'success',
    floating: true,
    position: 'top',
    icon: 'auto',
  });
};

export const Error = (message: string) => {
  showMessage({
    statusBarHeight: StatusBar.currentHeight,
    message,
    type: 'danger',
    floating: true,
    position: 'top',
    icon: 'auto',
  });
};

export const Warning = (message: string) => {
  showMessage({
    statusBarHeight: StatusBar.currentHeight,
    message,
    type: 'warning',
    floating: true,
    position: 'center',
    icon: 'auto',
  });
};
