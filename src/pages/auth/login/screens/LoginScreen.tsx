import React from 'react';
import {Screen} from '@components';
import {Header} from '@components/header';
import {Login} from '../containers';

const LoginScreen = () => {
  return (
    <Screen>
      <Header title="Login" />
      <Login />
    </Screen>
  );
};

export default LoginScreen;
