import React from 'react';
import {Screen} from '@components';
import {Transfer, TransferHeader} from '../containers';

const TransferScreen = () => {
  return (
    <Screen>
      <TransferHeader />
      <Transfer />
    </Screen>
  );
};

export default TransferScreen;
