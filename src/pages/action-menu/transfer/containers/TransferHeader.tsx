import React from 'react';
import {MenuType} from '@components';
import {Header} from '@components/header';

type TransferHeaderProps = {
  menuState: [MenuType | undefined, React.Dispatch<React.SetStateAction<MenuType | undefined>>];
};

const TransferHeader = ({menuState}: TransferHeaderProps) => {
  const setMenu = menuState[1];
  return (
    <Header
      title="Transfer"
      color="blue_1"
      titleColor="white_1"
      onBack={() => setMenu(null as unknown as MenuType)}
    />
  );
};

export default TransferHeader;
