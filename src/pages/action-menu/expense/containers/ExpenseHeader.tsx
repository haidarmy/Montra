import React from 'react';
import {MenuType} from '@components';
import {Header} from '@components/header';

type ExpenseHeaderProps = {
  menuState: [MenuType | undefined, React.Dispatch<React.SetStateAction<MenuType | undefined>>];
};

const ExpenseHeader = ({menuState}: ExpenseHeaderProps) => {
  const setMenu = menuState[1];
  return (
    <Header
      title="Expense"
      color="red_1"
      titleColor="white_1"
      onBack={() => setMenu(null as unknown as MenuType)}
    />
  );
};

export default ExpenseHeader;
