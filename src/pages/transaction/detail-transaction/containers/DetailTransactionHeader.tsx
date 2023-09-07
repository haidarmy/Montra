import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Icon} from '@components';
import {Header} from '@components/header';
import {ThemeColor, theme} from '@themes';

type DetailTransactionHeaderProps = {
  headerColor: ThemeColor;
  onRightAction(): void;
};

const DetailTransactionHeader = ({headerColor, onRightAction}: DetailTransactionHeaderProps) => {
  const navigation = useNavigation();
  return (
    <Header
      title="Detail Transaction"
      color={headerColor}
      titleColor="white_1"
      rightIcon={<Icon type="trash" fill={theme['white_1']} />}
      rightAction={onRightAction}
      onBack={() => navigation.goBack()}
    />
  );
};

export default DetailTransactionHeader;
