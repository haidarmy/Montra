import React from 'react';
import {MenuType, Screen} from '@components';
import {Expense, ExpenseHeader} from '../containers';

interface ExpenseScreenProps {
  menuState: [MenuType | undefined, React.Dispatch<React.SetStateAction<MenuType | undefined>>];
}

const ExpenseScreen = ({menuState}: ExpenseScreenProps) => {
  return (
    <Screen>
      <ExpenseHeader menuState={menuState} />
      <Expense />
    </Screen>
  );
};

export default ExpenseScreen;
