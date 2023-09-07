import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Header} from '@components/header';

const IncomeHeader = () => {
  const navigation = useNavigation();

  return (
    <Header
      title="Income"
      color="green_1"
      titleColor="white_1"
      onBack={() => navigation.goBack()}
    />
  );
};

export default IncomeHeader;
