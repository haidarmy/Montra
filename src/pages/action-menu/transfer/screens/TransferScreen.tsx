import React from 'react';
import {MenuType, Screen} from '@components';
import {Transfer, TransferHeader} from '../containers';

interface TransferScreenProps {
  menuState: [MenuType | undefined, React.Dispatch<React.SetStateAction<MenuType | undefined>>];
}

const TransferScreen = ({menuState}: TransferScreenProps) => {
  return (
    <Screen>
      <TransferHeader menuState={menuState} />
      <Transfer />
    </Screen>
  );
};

export default TransferScreen;
