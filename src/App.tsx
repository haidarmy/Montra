import NavigationStack from '@navigations/NavigationStack';
import React from 'react';
import FlashMessage from 'react-native-flash-message';

const App = () => {
  return (
    <>
      <FlashMessage position="top" />
      <NavigationStack />
    </>
  );
};
export default App;
