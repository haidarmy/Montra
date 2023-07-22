import {Button, Icon, Input, Text} from '@components';
import {theme} from '@themes';
import {BankType} from '@types';
import {fontFamily} from '@utils';
import React, {ReactElement, useCallback, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import CurrencyInput from 'react-native-currency-input';

const AddNewAccount = () => {
  const [bank, setBank] = useState<BankType>();
  const [balance, setBalance] = useState<number | null>(10000);

  const renderBalanceInput = useMemo(
    () => (
      <View style={{paddingHorizontal: 16}}>
        <Text type="title_3" color="white_5">
          Balance
        </Text>
        <CurrencyInput
          value={balance}
          onChangeValue={setBalance}
          prefix="Rp"
          delimiter="."
          separator=","
          precision={0}
          minValue={0}
          maxLength={12}
          style={{
            fontFamily: fontFamily['title_1'],
            fontSize: 48,
            color: theme['white_1'],
          }}
        />
      </View>
    ),
    [balance],
  );

  const renderBankIcon = useCallback(
    (icon: ReactElement, type: BankType) => (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setBank(type)}
        style={StyleSheet.flatten([
          styles.bankWrapper,
          type === bank && {borderWidth: 2, borderColor: theme.violet_1},
        ])}>
        {icon}
      </TouchableOpacity>
    ),
    [bank],
  );

  const renderSheetMenu = useMemo(() => {
    return (
      <View style={styles.bottomSheet}>
        <Input placeholder="Name" style={{marginBottom: 16}} />
        <Text type="regular_2" color="black_3">
          Bank
        </Text>
        <View style={styles.bankOptionsContainer}>
          {renderBankIcon(<Icon width={24} height={24} type="bank-chase" />, 'BANK_CHASE')}
          {renderBankIcon(<Icon width={24} height={24} type="paypal" />, 'PAYPAL')}
          {renderBankIcon(<Icon width={24} height={24} type="bank-citi" />, 'BANK_CITI')}
          {renderBankIcon(<Icon width={24} height={24} type="bank-america" />, 'BANK_AMERICA')}
          {renderBankIcon(<Icon width={24} height={24} type="bank-jago" />, 'BANK_JAGO')}
          {renderBankIcon(<Icon width={60} height={28} type="bank-mandiri" />, 'BANK_MANDIRI')}
          {renderBankIcon(<Icon width={32} height={32} type="bank-bca" />, 'BANK_BCA')}
          {renderBankIcon(
            <Text type="regular_1" color="violet_1">
              Other
            </Text>,
            'OTHER',
          )}
        </View>
        <Button type="solid" color="violet_1" tittle="Continue" tittleColor="white_1" />
      </View>
    );
  }, [renderBankIcon]);

  return (
    <View style={styles.page}>
      {renderBalanceInput}
      {renderSheetMenu}
    </View>
  );
};

export default AddNewAccount;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.violet_1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: theme.white_1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
  },
  bankWrapper: {
    backgroundColor: theme.white_5,
    width: 80,
    marginTop: 16,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
});
