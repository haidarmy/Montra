import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {useAuthStore} from '@zustand';
import React, {useCallback, useEffect, useMemo} from 'react';
import SplashScreen from 'react-native-splash-screen';
import AuthStack from './AuthStack';
import HomeTab from './HomeTab';

type AppStatusType = {
  hadRegistered: boolean;
};

const RootStack = () => {
  const {dispatch, isLoading, isLogin, hadRegistered, hadSetupAccount} = useAuthStore(state => ({
    dispatch: state.dispatch,
    isLoading: state.isLoading,
    isLogin: state.isLogin,
    hadRegistered: state.hadRegistered,
    hadSetupAccount: state.hadSetupAccount,
  }));

  const {getItem: getAppStatus} = useAsyncStorage('app-status');

  const handleCheckUserAccountSetup = useCallback(async (userState: FirebaseAuthTypes.User) => {
    try {
      const {uid} = userState;
      const walletCollection = firestore().collection('Wallets');
      const snapShots = await walletCollection.doc(uid).collection('userWallets').get();
      const data = snapShots.docs.map(doc => doc.data());
      if (data?.length) dispatch({type: 'SETUP_ACCOUNT', value: true});
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      console.log(message);
    }
  }, []);

  const handleIsLoggedIn = useCallback(() => {
    auth().onAuthStateChanged(async userState => {
      if (!userState) return dispatch({type: 'LOADING', value: false});
      dispatch({type: 'LOGIN', value: true});
      await handleCheckUserAccountSetup(userState);
      return dispatch({type: 'LOADING', value: false});
    });
  }, [handleCheckUserAccountSetup]);

  const handleAppStatus = useCallback(async () => {
    const appStatus = await getAppStatus();
    const {hadRegistered: registered} = (JSON.parse(appStatus!) as AppStatusType) ?? {};
    if (!registered) return dispatch({type: 'LOADING', value: false});
    dispatch({type: 'REGISTERED', value: registered});
    handleIsLoggedIn();
  }, [handleIsLoggedIn]);

  useEffect(() => {
    void handleAppStatus();
  }, [handleAppStatus]);

  useEffect(() => {
    !isLoading && SplashScreen.hide();
  }, [isLoading]);

  const renderAppRoutes = useMemo(() => {
    if (isLoading) return;
    if (hadRegistered && isLogin && hadSetupAccount) {
      return <HomeTab />;
    }
    if (hadRegistered && isLogin && !hadSetupAccount) {
      return <AuthStack initialRoute="SetupAccount" />;
    }
    if (hadRegistered && !isLogin && !hadSetupAccount) {
      return <AuthStack initialRoute="Login" />;
    }
    if (!hadRegistered && !isLogin && !hadSetupAccount) {
      return <AuthStack initialRoute="Onboarding" />;
    }
  }, [hadRegistered, hadSetupAccount, isLoading, isLogin]);

  return <NavigationContainer>{renderAppRoutes}</NavigationContainer>;
};

export default RootStack;
