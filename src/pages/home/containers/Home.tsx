import React from 'react';
import {StyleSheet, View} from 'react-native';
import {theme} from '@themes';
import ExpenseInformation from './ExpenseInformation';
import RecentTransaction from './RecentTransaction';

const Home = () => {
  return (
    <View style={styles.page}>
      <ExpenseInformation />
      <RecentTransaction />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.white_1,
  },
});
