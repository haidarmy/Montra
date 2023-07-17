import {Screen} from '@components';
import {Header} from '@components/header';
import React from 'react';
import {SignUp} from '../containers';

const SignUpScreen = () => {
  return (
    <Screen>
      <Header title="Sign Up" />
      <SignUp />
    </Screen>
  );
};

export default SignUpScreen;
