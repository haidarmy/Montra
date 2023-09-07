import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Header} from '@components/header';

const ExpenseHeader = () => {
  const navigation = useNavigation();

  return (
    <Header title="Expense" color="red_1" titleColor="white_1" onBack={() => navigation.goBack()} />
  );
};

export default ExpenseHeader;
