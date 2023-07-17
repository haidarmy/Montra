import {Text} from '@components';
import {LoginScreen, OnboardingScreen, SignUpScreen} from '@pages';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <>
      <SignUpScreen />
    </>
  );
};
export default App;
