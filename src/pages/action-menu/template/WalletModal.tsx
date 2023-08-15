/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useCallback, useMemo} from 'react';
import {Dimensions, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Icon, Text} from '@components';
import {theme} from '@themes';
import {BankType, IconType, UserWalletDataResponse} from '@types';

export interface WalletModalProps<T> {
  toggleModalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  formState: [T, (formType: keyof T, formValue?: any) => void];
  userWalletsData: UserWalletDataResponse[];
  onSelect?(data: UserWalletDataResponse): void;
  walletType?: 'SENDER' | 'RECEIVER';
}

export const handleWalletIcon = (bank: BankType): IconType => {
  if (bank === 'BANK_AMERICA') return 'bank-america';
  if (bank === 'BANK_BCA') return 'bank-bca';
  if (bank === 'BANK_CHASE') return 'bank-chase';
  if (bank === 'BANK_CITI') return 'bank-citi';
  if (bank === 'BANK_JAGO') return 'bank-jago';
  if (bank === 'BANK_MANDIRI') return 'bank-mandiri';
  if (bank === 'PAYPAL') return 'paypal';
  if (bank === 'OTHER') return 'wallet_3';
  return 'wallet_3';
};

export const handleWalletBank = (bank: BankType) => {
  if (bank === 'BANK_AMERICA') return 'Bank America';
  if (bank === 'BANK_BCA') return 'Bank BCA';
  if (bank === 'BANK_CHASE') return 'Bank Chase';
  if (bank === 'BANK_CITI') return 'Bank Citi';
  if (bank === 'BANK_JAGO') return 'Bank Jago';
  if (bank === 'BANK_MANDIRI') return 'Bank Mandiri';
  if (bank === 'PAYPAL') return 'Paypal';
};

const WalletModal = <
  T extends {
    wallet?: UserWalletDataResponse;
    senderWallet?: UserWalletDataResponse;
    receiverWallet?: UserWalletDataResponse;
  },
>({
  formState,
  toggleModalState,
  userWalletsData,
  onSelect,
  walletType,
}: WalletModalProps<T>) => {
  const [form, setForm] = formState;
  const [isVisible, setModalVisible] = toggleModalState;

  const handleSelectWallet = useCallback(
    (data: UserWalletDataResponse) => {
      !onSelect && setForm('wallet', data);
      onSelect && onSelect(data);
      setModalVisible(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setForm],
  );

  const handleRenderWalletList = useMemo(() => {
    return userWalletsData.map((wallet, idx) => (
      <TouchableOpacity
        key={idx}
        activeOpacity={0.7}
        style={StyleSheet.flatten([
          styles.walletContainer,
          walletType == 'RECEIVER' && {
            borderColor: form.receiverWallet?.id === wallet.id ? theme.violet_1 : theme.white_5,
          },
          walletType == 'SENDER' && {
            borderColor: form.senderWallet?.id === wallet.id ? theme.violet_1 : theme.white_5,
          },
          !walletType && {
            borderColor: form.wallet?.id === wallet.id ? theme.violet_1 : theme.white_5,
          },
        ])}
        onPress={() => handleSelectWallet(wallet)}>
        <Icon type={handleWalletIcon(wallet.bank)} width={100} />
        <View style={{marginLeft: 20, flex: 1}}>
          <Text type="title_3" color="black_3">
            {wallet.cardHolderName}
          </Text>
          <Text type="small" color="black_4">
            {handleWalletBank(wallet.bank)}
          </Text>
        </View>
        {walletType === 'RECEIVER' && form.receiverWallet?.id === wallet.id && (
          <View style={styles.check}>
            <Icon type="check" />
          </View>
        )}
        {walletType === 'SENDER' && form.senderWallet?.id === wallet.id && (
          <View style={styles.check}>
            <Icon type="check" />
          </View>
        )}
        {!walletType && form.wallet?.id === wallet.id && (
          <View style={styles.check}>
            <Icon type="check" />
          </View>
        )}
      </TouchableOpacity>
    ));
  }, [
    form.receiverWallet?.id,
    form.senderWallet?.id,
    form.wallet?.id,
    handleSelectWallet,
    userWalletsData,
    walletType,
  ]);

  const renderWalletModal = useMemo(
    () => (
      <Modal
        statusBarTranslucent
        backdropOpacity={0.25}
        style={styles.modal}
        isVisible={isVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        swipeDirection="down"
        deviceHeight={Dimensions.get('screen').height}>
        <ScrollView style={{...styles.container, flexGrow: 0}}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.closeWrapper}
            onPress={() => setModalVisible(false)}>
            <Icon type="cross" fill={theme.black_1} width={20} />
          </TouchableOpacity>
          {handleRenderWalletList}
        </ScrollView>
      </Modal>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleRenderWalletList, isVisible],
  );

  return renderWalletModal;
};

export default WalletModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  closeWrapper: {
    top: 10,
    left: Dimensions.get('screen').width / 1.25,
    height: 54,
    width: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  container: {
    backgroundColor: theme.white_1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    position: 'relative',
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 8,
    borderWidth: 3,
    marginBottom: 24,
  },
  check: {
    padding: 4,
    backgroundColor: theme.white_4,
    borderRadius: 8,
  },
});
