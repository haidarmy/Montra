import React from 'react';
import {Screen} from '@components';
import {Expense, ExpenseHeader} from '../containers';

const ExpenseScreen = () => {
  return (
    <Screen>
      <ExpenseHeader />
      <Expense />
    </Screen>
  );
};

export default ExpenseScreen;
