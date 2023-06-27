import {Text} from '@components';
import Icon from '@components/icon/Icon';
import Illustration from '@components/illustration/Illustration';
import React from 'react';
import {View} from 'react-native';

const App = () => {
  return (
    <View>
      <Text type="title_x">Hello World!</Text>
      <Icon type="camera" />
      <Illustration type="data" />
    </View>
  );
};

export default App;
