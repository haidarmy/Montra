import {authErrors} from '@constants';
import {AuthErrorType, ErrorMessageType} from '@types';

export const getErrorMessage = (errorCode: AuthErrorType) => {
  const [type, code] = errorCode.split('/');
  switch (type) {
    case 'auth':
      return authErrors[code as ErrorMessageType];
    default:
      return 'Error';
  }
};
