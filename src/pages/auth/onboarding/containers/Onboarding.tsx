import {Button} from '@components';
import {AuthScreenNavigationProp} from '@navigations';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {theme} from '@themes';
import {UserData} from '@types';
import React, {useCallback, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import OnboardingBox from './OnboardingBox';

const Onboarding = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const {getItem} = useAsyncStorage('user');
  const {getItem: getAppStatus} = useAsyncStorage('app-status');

  const handleCheckUserAccountSetup = useCallback(
    async (userState: FirebaseAuthTypes.User | null) => {
      !userState && navigation.replace('Login');
      try {
        const walletCollection = firestore().collection('Wallets');
        const userData = await getItem();
        const {id: uid} = JSON.parse(userData ?? '') as UserData;
        const snapShots = await walletCollection.doc(uid).get();
        if (!snapShots.exists) return navigation.replace('SetupAccount');
        // navigation.replace('Home')
      } catch (error) {
        console.log(error);
      }
    },
    [getItem, navigation],
  );

  const handleIsLoggedIn = useCallback(() => {
    auth().onAuthStateChanged(async userState => {
      await handleCheckUserAccountSetup(userState);
    });
  }, [handleCheckUserAccountSetup]);

  const handleAppStatus = useCallback(async () => {
    //TODO Need to be improved: SplashScreen.hide() is weirdly invoked immediately before the handleIsLoggedIn() resolve
    const hadRegistered = await getAppStatus();
    hadRegistered && handleIsLoggedIn();
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, [getAppStatus, handleIsLoggedIn]);

  useEffect(() => {
    void handleAppStatus();
  }, [handleAppStatus]);

  return (
    <View style={{flex: 1, backgroundColor: theme.white_1}}>
      <View style={{flexGrow: 1}}>
        <OnboardingBox />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          type="solid"
          color="violet_1"
          tittle="Sign Up"
          tittleColor="white_1"
          onPress={() => navigation.navigate('SignUp')}
          style={{marginBottom: 16}}
        />
        <Button
          type="solid"
          color="violet_5"
          tittle="Login"
          tittleColor="violet_1"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  );
};

export default Onboarding;
const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: -72,
    marginBottom: 32,
    paddingTop: 30,
    backgroundColor: theme.white_1,
  },
});
