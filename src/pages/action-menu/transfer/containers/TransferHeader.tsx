import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Header} from '@components/header';

const TransferHeader = () => {
  const navigation = useNavigation();

  return (
    <Header
      title="Transfer"
      color="blue_1"
      titleColor="white_1"
      onBack={() => navigation.goBack()}
    />
  );
};

export default TransferHeader;
