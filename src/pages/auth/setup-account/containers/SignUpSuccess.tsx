import {Icon, Text} from '@components';
import {AuthScreenNavigationProp} from '@navigations';
import {useNavigation} from '@react-navigation/native';
import {theme} from '@themes';
import {useAuthStore} from '@zustand';
import React, {useEffect} from 'react';
import {View} from 'react-native';

const SignUpSuccess = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const dispatch = useAuthStore(state => state.dispatch);

  useEffect(() => {
    setTimeout(() => {
      dispatch({type: 'SETUP_ACCOUNT', value: true});
    }, 2000);
  }, [navigation]);

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
