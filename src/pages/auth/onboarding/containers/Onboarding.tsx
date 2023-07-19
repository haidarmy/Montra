import {Button} from '@components';
import {theme} from '@themes';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import OnboardingBox from './OnboardingBox';

const Onboarding = () => {
  return (
    <View style={{flex: 1, backgroundColor: theme.white_1}}>
      <View style={{flexGrow: 1}}>
        <OnboardingBox />
      </View>
      <View style={styles.buttonContainer}>
        <Button type="solid" color="violet_1" tittle="Sign up" tittleColor="white_1" />
        <Button type="solid" color="violet_5" tittle="Login" tittleColor="violet_1" />
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
