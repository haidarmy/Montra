/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import {Text} from '@components';
import {theme} from '@themes';
import {fontFamily} from '@utils';

interface BalanceProps<T> {
  formState: [T, (formType: keyof T, formValue?: any) => void];
}

const Balance = <T extends {balance: number}>({formState}: BalanceProps<T>) => {
  const [form, setForm] = formState;

  return (
    <View style={{paddingHorizontal: 16}}>
      <Text type="title_3" color="white_5">
        How much?
      </Text>
      <CurrencyInput
        value={form.balance}
        onChangeValue={value => value !== 0 && setForm('balance', value)}
        prefix="Rp"
        delimiter="."
        separator=","
        precision={0}
        minValue={0}
        maxLength={12}
        style={styles.input}
      />
    </View>
  );
};

export default Balance;

const styles = StyleSheet.create({
  input: {
    fontFamily: fontFamily['title_1'],
    fontSize: 48,
    color: theme['white_1'],
  },
});
