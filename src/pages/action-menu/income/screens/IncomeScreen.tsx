import React from 'react';
import {Screen} from '@components';
import {Income, IncomeHeader} from '../containers';

const IncomeScreen = () => {
  return (
    <Screen>
      <IncomeHeader />
      <Income />
    </Screen>
  );
};

export default IncomeScreen;
