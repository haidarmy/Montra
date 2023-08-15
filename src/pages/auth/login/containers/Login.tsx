import React, {useCallback, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {Alert, Button, Icon, Input, Text} from '@components';
import {useForm} from '@hooks';
import {AuthScreenNavigationProp} from '@navigations';
import {theme} from '@themes';
import {AuthErrorType, InputState} from '@types';
import {getErrorMessage} from '@utils';
import {useAuthStore} from '@zustand';

const Login = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const dispatch = useAuthStore(state => state.dispatch);
  const {setItem: setAppStatus} = useAsyncStorage('app-status');
  const {setItem} = useAsyncStorage('user');
  const inputState = useState<InputState>('NO_ERROR');
  const setInput = inputState[1];
  const [form, setForm] = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = useCallback(async () => {
    if (!form.email || !form.password) {
      setInput('ERROR');
      setForm('password', '');
      return Alert.Error('Please fill out all required fields.');
    }
    try {
      dispatch({type: 'LOADING', value: true});
      const {
        user: {uid},
      } = await auth().signInWithEmailAndPassword(form.email, form.password);
      const userData = {email: form.email, id: uid};
      await setItem(JSON.stringify(userData));
      await setAppStatus(JSON.stringify({hadRegistered: true}));
      setForm('reset');
    } catch (e) {
      setInput('ERROR');
      setForm('password', '');
      const error = e as FirebaseAuthTypes.PhoneAuthError;
      Alert.Error(getErrorMessage(error.code as AuthErrorType));
    }
    dispatch({type: 'LOADING', value: false});
  }, [dispatch, form.email, form.password, setForm, setInput, setItem]);

  const handleNavigateToSignUp = useCallback(() => {
    navigation.navigate('SignUp');
    setInput('NO_ERROR');
    setForm('reset');
  }, [navigation, setForm, setInput]);

  const renderInputForms = useMemo(
    () => (
      <>
        <Input
          style={{marginBottom: 24}}
          placeholder="Email"
          inputState={inputState}
          value={form.email}
          onChangeText={value => setForm('email', value)}
        />
        <Input
          style={{marginBottom: 40}}
          placeholder="Password"
          inputState={inputState}
          value={form.password}
          onChangeText={value => setForm('password', value)}
          secureTextEntry
          rightIcon={
            <Icon type={'show_outline'} stroke={theme['white_6']} fill={theme['white_1']} />
          }
        />
        <Button
          color="violet_1"
          type="solid"
          tittle="Login"
          tittleColor="white_1"
          style={{marginBottom: 24}}
          onPress={handleSubmit}
        />
      </>
    ),
    [form.email, form.password, handleSubmit, inputState, setForm],
  );

  const renderSignUp = useMemo(
    () => (
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Text type="regular_2" color="white_6">
          Don’t have an account yet?{' '}
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={handleNavigateToSignUp}>
          <Text type="regular_2" color="violet_1">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [handleNavigateToSignUp],
  );

  return (
    <View style={{flex: 1, backgroundColor: theme.white_1}}>
      <View style={{paddingHorizontal: 16, marginTop: 56}}>
        {renderInputForms}
        {renderSignUp}
      </View>
    </View>
  );
};

export default Login;
