import React from 'react';
import {MenuType} from '@components';
import {Header} from '@components/header';

type IncomeHeaderProps = {
  menuState: [MenuType | undefined, React.Dispatch<React.SetStateAction<MenuType | undefined>>];
};

const IncomeHeader = ({menuState}: IncomeHeaderProps) => {
  const setMenu = menuState[1];
  return (
    <Header
      title="Income"
      color="green_1"
      titleColor="white_1"
      onBack={() => setMenu(null as unknown as MenuType)}
    />
  );
};

export default IncomeHeader;
