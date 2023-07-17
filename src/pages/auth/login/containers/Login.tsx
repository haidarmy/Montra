import {Button, Gap, Icon, Input, Text} from '@components';
import {theme} from '@themes';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';

const Login = () => {
  return (
    <View style={{flex: 1, backgroundColor: theme.white_1}}>
      <View style={{paddingHorizontal: 16}}>
        <Gap height={56} />
        <Input style={{marginBottom: 24}} placeholder="Email" />
        <Input
          style={{marginBottom: 40}}
          placeholder="Password"
          secureTextEntry
          rightIcon={
            <Icon type={'show_outline'} stroke={theme['white_6']} fill={theme['white_1']} />
          }
        />
        <Button color="violet_1" type="solid" tittle="Login" tittleColor="white_1" />
        <Gap height={24} />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text type="regular_2" color="white_6">
            Don’t have an account yet?{' '}
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text type="regular_2" color="violet_1">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
