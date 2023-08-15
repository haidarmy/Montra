import React from 'react';
import {MenuType, Screen} from '@components';
import {Income, IncomeHeader} from '../containers';

interface IncomeScreenProps {
  menuState: [MenuType | undefined, React.Dispatch<React.SetStateAction<MenuType | undefined>>];
}

const IncomeScreen = ({menuState}: IncomeScreenProps) => {
  return (
    <Screen>
      <IncomeHeader menuState={menuState} />
      <Income />
    </Screen>
  );
};

export default IncomeScreen;
