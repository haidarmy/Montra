import {Screen} from '@components';
import React from 'react';
import {Header} from '@components/header';
import {AddNewAccount} from '../containers';

const AddNewAccountScreen = () => {
  return (
    <Screen>
      <Header title="Add new account" color="violet_1" titleColor="white_1" />
      <AddNewAccount />
    </Screen>
  );
};

export default AddNewAccountScreen;
