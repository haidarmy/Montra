import React, {useMemo} from 'react';
import FlashMessage from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import RootStack from '@navigations/Root/RootStack';
import {theme} from '@themes';
import {useAuthStore} from '@zustand';

const App = () => {
  const isLoading = useAuthStore(state => state.isLoading);
  const renderLoadingSpinner = useMemo(
    () => (
      <Spinner
        visible={isLoading}
        textContent={'loading...'}
        color={theme.white_4}
        textStyle={{color: theme.white_4}}
      />
    ),
    [isLoading],
  );
  return (
    <>
      <RootStack />
      <FlashMessage position="top" />
      {renderLoadingSpinner}
    </>
  );
};
export default App;
