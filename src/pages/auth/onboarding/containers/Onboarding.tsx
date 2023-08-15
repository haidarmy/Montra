import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from '@components';
import {AuthScreenNavigationProp} from '@navigations';
import {theme} from '@themes';
import OnboardingBox from './OnboardingBox';

const Onboarding = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();

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
