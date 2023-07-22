import {Icon, Text} from '@components';
import {theme} from '@themes';
import React from 'react';
import {View} from 'react-native';

const SignUpSuccess = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icon type="success" fill={theme.green_1} width={128} height={128} />
      <Text type="regular_1" style={{fontSize: 24}}>
        You are set!
      </Text>
    </View>
  );
};

export default SignUpSuccess;
