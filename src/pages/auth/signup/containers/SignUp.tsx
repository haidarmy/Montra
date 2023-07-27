import {Alert, Button, Icon, Input, Text} from '@components';
import {useForm} from '@hooks';
import {AuthScreenNavigationProp} from '@navigations';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {theme} from '@themes';
import {AuthErrorType, InputState} from '@types';
import {getErrorMessage} from '@utils';
import React, {useCallback, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';

const SignUp = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const {setItem} = useAsyncStorage('user');
  const {setItem: setAppStatus} = useAsyncStorage('app-status');
  const inputState = useState<InputState>('NO_ERROR');
  const setInput = inputState[1];
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useForm({
    name: '',
    email: '',
    password: '',
  });

  const handleAddUserDataToDB = useCallback(
    async (uid: string) => {
      try {
        const usersCollection = firestore().collection('Users');
        await usersCollection.doc(uid).set({name: form.name, email: form.email});
        const userData = {email: form.email, id: uid};
        await setItem(JSON.stringify(userData));
        await setAppStatus(JSON.stringify({hadRegistered: true}));
        setLoading(false);
        navigation.reset({index: 0, routes: [{name: 'SetupAccount'}]});
        setForm('reset');
      } catch (e) {
        setLoading(false);
        Alert.Error('Failed to add user data');
      }
    },
    [form.email, form.name, navigation, setAppStatus, setForm, setItem],
  );

  const handleSubmit = useCallback(async () => {
    if (!form.name || !form.email || !form.password) {
      setInput('ERROR');
      setForm('password', '');
      return Alert.Error('Please fill out all required fields.');
    }
    try {
      setLoading(true);
      const {
        user: {uid},
      } = await auth().createUserWithEmailAndPassword(form.email, form.password);
      await handleAddUserDataToDB(uid);
    } catch (e) {
      setInput('ERROR');
      setForm('password', '');
      setLoading(false);
      const error = e as FirebaseAuthTypes.PhoneAuthError;
      Alert.Error(getErrorMessage(error.code as AuthErrorType));
    }
  }, [form.email, form.name, form.password, handleAddUserDataToDB, setForm, setInput]);

  const handleNavigateToLogin = useCallback(() => {
    navigation.navigate('Login');
    setInput('NO_ERROR');
    setForm('reset');
  }, [navigation, setForm, setInput]);

  const renderInputForms = useMemo(
    () => (
      <>
        <Input
          style={{marginBottom: 24}}
          placeholder="Name"
          value={form.name}
          inputState={inputState}
          onChangeText={value => setForm('name', value)}
        />
        <Input
          style={{marginBottom: 24}}
          placeholder="Email"
          value={form.email}
          inputState={inputState}
          onChangeText={value => setForm('email', value)}
        />
        <Input
          style={{marginBottom: 40}}
          placeholder="Password"
          value={form.password}
          inputState={inputState}
          onChangeText={value => setForm('password', value)}
          secureTextEntry
          rightIcon={
            <Icon type={'show_outline'} stroke={theme['white_6']} fill={theme['white_1']} />
          }
        />
        <Button
          color="violet_1"
          type="solid"
          tittle="Sign Up"
          tittleColor="white_1"
          onPress={handleSubmit}
        />
      </>
    ),
    [form.email, form.name, form.password, handleSubmit, inputState, setForm],
  );

  const renderLogin = useMemo(
    () => (
      <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 24}}>
        <Text type="regular_2" color="white_6">
          Already have an account?{' '}
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={handleNavigateToLogin}>
          <Text type="regular_2" color="violet_1">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [handleNavigateToLogin],
  );

  const renderLoadingSpinner = useMemo(
    () => (
      <Spinner
        visible={loading}
        textContent={'loading...'}
        color={theme.white_4}
        textStyle={{color: theme.white_4}}
      />
    ),
    [loading],
  );

  return (
    <View style={{flex: 1, backgroundColor: theme.white_1}}>
      <View style={{paddingHorizontal: 16, marginTop: 56}}>
        {renderInputForms}
        {renderLogin}
        {renderLoadingSpinner}
      </View>
    </View>
  );
};

export default SignUp;
