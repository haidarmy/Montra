import {Text} from '@components';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <View>
      <Text type="title_x">Hello World!</Text>
    </View>
  );
};

export default App;
