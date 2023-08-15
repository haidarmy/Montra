/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useMemo} from 'react';
import {ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Icon, Input, Text} from '@components';
import {theme} from '@themes';
import {CaptureData, ExpenseCategoryType, IncomeCategoryType, UserWalletDataResponse} from '@types';
import {getCategoryColor} from './CategoryModal';
import {handleWalletIcon} from './WalletModal';

export interface InputFormProps<T> {
  toggleAttachmentModalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  toggleCategoryModalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  toggleWalletModalState?: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSenderWalletModalState?: React.Dispatch<React.SetStateAction<boolean>>;
  toggleReceiverWalletModalState?: React.Dispatch<React.SetStateAction<boolean>>;
  formState: [T, (formType: keyof T, formValue?: any) => void];
  variant?: 'TRANSFER' | 'INCOME' | 'EXPENSE';
  onSubmit(): void;
}

export const getFormattedCategory = (str: string) => {
  const arr = str.split('_');

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLocaleLowerCase();
  }

  return arr.join(' ');
};

const InputForm = <
  T extends {
    attachment: CaptureData;
    balance: number;
    category?: ExpenseCategoryType | IncomeCategoryType;
    wallet?: UserWalletDataResponse;
    senderWallet?: UserWalletDataResponse;
    receiverWallet?: UserWalletDataResponse;
    description: string;
  },
>({
  formState,
  toggleAttachmentModalState,
  toggleCategoryModalState,
  toggleWalletModalState,
  toggleSenderWalletModalState,
  toggleReceiverWalletModalState,
  variant,
  onSubmit,
}: InputFormProps<T>) => {
  const [form, setForm] = formState;
  const setAttachmentModalVisible = toggleAttachmentModalState[1];
  const setCategoryModalVisible = toggleCategoryModalState[1];

  const renderAttachment = useMemo(
    () =>
      form.attachment.uri && (
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{uri: form.attachment.uri}}
            resizeMode="cover"
            style={styles.imageWrapper}
            imageStyle={{borderRadius: 5}}>
            <TouchableOpacity
              onPress={() => setForm('attachment', {})}
              activeOpacity={0.8}
              style={styles.deleteButton}>
              <Icon type="close" width={24} fill={theme.white_5} />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      ),
    [form.attachment.uri, setForm],
  );

  const categoryProps: Omit<React.ComponentProps<typeof Input>, 'children'> = useMemo(
    () => ({
      placeholder: 'Category',
      value: form.category && getFormattedCategory(form.category),
      style: {marginBottom: 16},
      rightIcon: <Icon type="arrow_down_2" fill={theme.white_6} />,
      rightIconAction: () => setCategoryModalVisible(true),
      leftIcon: form.category ? (
        <View
          style={StyleSheet.flatten([
            styles.category,
            {backgroundColor: getCategoryColor(form.category)},
          ])}
        />
      ) : undefined,
      disabled: true,
    }),
    [form, setCategoryModalVisible],
  );

  const walletProps: Omit<React.ComponentProps<typeof Input>, 'children'> = useMemo(
    () => ({
      placeholder: 'Wallet',
      value: form?.wallet?.cardHolderName,
      style: {marginBottom: 16},
      rightIcon: <Icon type="arrow_down_2" fill={theme.white_6} />,
      rightIconAction: () => toggleWalletModalState && toggleWalletModalState(true),
      leftIcon: form?.wallet?.cardHolderName ? (
        <Icon type={handleWalletIcon(form.wallet.bank)} width={100} />
      ) : undefined,
      disabled: true,
    }),
    [form.wallet?.bank, form.wallet?.cardHolderName, toggleWalletModalState],
  );
  const senderWalletProps: Omit<React.ComponentProps<typeof Input>, 'children'> = useMemo(
    () => ({
      placeholder: 'From',
      value: form?.senderWallet?.cardHolderName,
      rightIcon: <Icon type="arrow_down_2" fill={theme.white_6} />,
      rightIconAction: () => toggleSenderWalletModalState && toggleSenderWalletModalState(true),
      leftIcon: form?.senderWallet?.cardHolderName ? (
        <Icon type={handleWalletIcon(form.senderWallet.bank)} width={100} />
      ) : undefined,
      disabled: true,
    }),
    [form.senderWallet?.bank, form.senderWallet?.cardHolderName, toggleSenderWalletModalState],
  );
  const receiverWalletProps: Omit<React.ComponentProps<typeof Input>, 'children'> = useMemo(
    () => ({
      placeholder: 'To',
      value: form?.receiverWallet?.cardHolderName,
      rightIcon: <Icon type="arrow_down_2" fill={theme.white_6} />,
      rightIconAction: () => toggleReceiverWalletModalState && toggleReceiverWalletModalState(true),
      leftIcon: form?.receiverWallet?.cardHolderName ? (
        <Icon type={handleWalletIcon(form.receiverWallet.bank)} width={100} />
      ) : undefined,
      disabled: true,
    }),
    [
      form.receiverWallet?.bank,
      form.receiverWallet?.cardHolderName,
      toggleReceiverWalletModalState,
    ],
  );

  const descProps: Omit<React.ComponentProps<typeof Input>, 'children'> = useMemo(
    () => ({
      placeholder: 'Description',
      value: form.description,
      onChangeText: val => setForm('description', val),
      multiline: true,
      numberOfLines: 3,
      maxLength: 200,
      textAlignVertical: form.description ? 'center' : 'top',
      style: {marginBottom: 16},
    }),
    [form.description, setForm],
  );

  const handleRenderTransferWallet = useMemo(
    () => (
      <View style={{marginBottom: 16}}>
        <Input {...senderWalletProps} />
        <View style={{alignSelf: 'center'}}>
          <Icon type="transfer_alternate" width={48} height={48} />
        </View>
        <Input {...receiverWalletProps} />
      </View>
    ),
    [receiverWalletProps, senderWalletProps],
  );

  return (
    <View style={styles.inputContainer}>
      <View>
        {variant !== 'TRANSFER' && <Input {...categoryProps} />}
        {variant !== 'TRANSFER' && <Input {...walletProps} />}
        {variant == 'TRANSFER' && handleRenderTransferWallet}
        <Input {...descProps} />
        {!form.attachment.uri && (
          <TouchableOpacity
            onPress={() => setAttachmentModalVisible(true)}
            activeOpacity={0.7}
            style={styles.attachmentContainer}>
            <Icon type="attachment" fill={theme.white_6} />
            <Text type="regular_1" color="white_6">
              Add attachment
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {renderAttachment}
      <Button
        type="solid"
        color="violet_1"
        tittle="Continue"
        tittleColor="white_1"
        onPress={onSubmit}
      />
    </View>
  );
};

export default InputForm;

const styles = StyleSheet.create({
  attachmentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderRadius: 16,
    borderColor: theme.white_5,
    borderStyle: 'dashed',
    marginBottom: 48,
  },
  inputContainer: {
    backgroundColor: theme.white_1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
  },
  imageContainer: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: theme.white_5,
    borderStyle: 'dashed',
    marginBottom: 48,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  imageWrapper: {
    width: 100,
    height: 120,
    marginBottom: 20,
    marginRight: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: -7,
    right: -7,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
