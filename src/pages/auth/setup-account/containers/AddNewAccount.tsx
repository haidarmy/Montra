import React, {ReactElement, useCallback, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {Alert, Button, Icon, Input, Text} from '@components';
import {useForm} from '@hooks';
import {AuthScreenNavigationProp} from '@navigations';
import {theme} from '@themes';
import {BankType, InputState, UserData, UserWalletData} from '@types';
import {fontFamily} from '@utils';

const AddNewAccount = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const {getItem} = useAsyncStorage('user');
  const inputState = useState<InputState>('NO_ERROR');
  const setInput = inputState[1];
  const [form, setForm] = useForm<UserWalletData>({
    balance: 0,
    bank: '' as BankType,
    cardHolderName: '',
  });

  const handleSubmit = useCallback(async () => {
    if (!form.cardHolderName) setInput('ERROR');
    if (!form.balance || !form.bank || !form.cardHolderName) {
      return Alert.Error('Please fill out all required fields.');
    }
    try {
      const userData = await getItem();
      const {id: uid} = JSON.parse(userData ?? '') as UserData;
      if (!uid) return Alert.Error('Failed to add user wallet data');
      const walletCollection = firestore().collection('Wallets');
      await walletCollection.doc(uid).collection('userWallets').add(form);
      navigation.replace('SignUpSuccess');
    } catch (e) {
      Alert.Error('Failed to add user wallet data');
    }
    setForm('reset');
  }, [form, navigation]);

  const renderBalanceInput = useMemo(
    () => (
      <View style={{paddingHorizontal: 16}}>
        <Text type="title_3" color="white_5">
          Balance
        </Text>
        <CurrencyInput
          value={form.balance}
          onChangeValue={value => setForm('balance', value !== 0 && value)}
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
    [form.balance, setForm],
  );

  const renderBankIcon = useCallback(
    (icon: ReactElement, type: BankType) => (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setForm('bank', type)}
        style={StyleSheet.flatten([
          styles.bankWrapper,
          type === form.bank && {borderWidth: 2, borderColor: theme.violet_1},
        ])}>
        {icon}
      </TouchableOpacity>
    ),
    [form.bank, setForm],
  );

  const renderSheetMenu = useMemo(() => {
    return (
      <View style={styles.bottomSheet}>
        <Input
          placeholder="Name"
          style={{marginBottom: 16}}
          inputState={inputState}
          value={form.cardHolderName}
          onChangeText={value => setForm('cardHolderName', value)}
        />
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
        <Button
          type="solid"
          color="violet_1"
          tittle="Continue"
          tittleColor="white_1"
          onPress={handleSubmit}
        />
      </View>
    );
  }, [form.cardHolderName, handleSubmit, inputState, renderBankIcon, setForm]);

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
