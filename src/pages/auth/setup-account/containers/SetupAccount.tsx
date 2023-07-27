import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button, Text} from '@components';
import {theme} from '@themes';
import {AuthScreenNavigationProp} from '@navigations';

const SetupAccount = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text type="regular_1" style={styles.title}>
          Let’s setup your account!
        </Text>
        <Text type="regular_1">{'Account can be your bank, credit card or\nyour wallet.'}</Text>
      </View>
      <Button
        type="solid"
        color="violet_1"
        tittle="Let’s go"
        tittleColor="white_1"
        onPress={() => navigation.replace('AddNewAccount')}
        style={{marginBottom: 50}}
      />
    </View>
  );
};

export default SetupAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white_1,
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
    paddingTop: 64,
  },
  title: {
    fontSize: 36,
    marginBottom: 32,
  },
});
