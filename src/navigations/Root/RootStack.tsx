import React, {useCallback, useEffect, useMemo, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from '@navigations/Auth/AuthStack';
import HomeTab from '@navigations/Home/HomeTab';
import {useAuthStore} from '@zustand';

type AppStatusType = {
  hadRegistered: boolean;
};

const RootStack = () => {
  const {dispatch, isLogin, hadRegistered, hadSetupAccount} = useAuthStore(state => ({
    dispatch: state.dispatch,
    isLogin: state.isLogin,
    hadRegistered: state.hadRegistered,
    hadSetupAccount: state.hadSetupAccount,
  }));

  const [loading, setLoading] = useState(true);

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
      if (!userState) return setLoading(false);
      dispatch({type: 'LOGIN', value: true});
      await handleCheckUserAccountSetup(userState);
      return setLoading(false);
    });
  }, [handleCheckUserAccountSetup]);

  const handleAppStatus = useCallback(async () => {
    const appStatus = await getAppStatus();
    const {hadRegistered: registered} = (JSON.parse(appStatus!) as AppStatusType) ?? {};
    if (!registered) return setLoading(false);
    dispatch({type: 'REGISTERED', value: registered});
    handleIsLoggedIn();
  }, [handleIsLoggedIn]);

  useEffect(() => {
    void handleAppStatus();
  }, [handleAppStatus]);

  useEffect(() => {
    !loading && SplashScreen.hide();
  }, [loading]);

  const renderAppRoutes = useMemo(() => {
    if (!loading) {
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
    }
  }, [hadRegistered, hadSetupAccount, loading, isLogin]);

  return <NavigationContainer>{renderAppRoutes}</NavigationContainer>;
};

export default RootStack;
