import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Alert} from '@components';
import {useForm} from '@hooks';
import {theme} from '@themes';
import {CaptureData, TransferFormType, UserData, UserWalletDataResponse} from '@types';
import {useAuthStore} from '@zustand';
import {AttachmentModal, Balance, InputForm, WalletModal} from '../../template';

const Transfer = () => {
  const {getItem: getUserData} = useAsyncStorage('user');
  const dispatch = useAuthStore(state => state.dispatch);

  const [userWalletsData, setUserWalletsData] = useState<UserWalletDataResponse[]>([]);
  const attachmentModalState = useState(false);
  const categoryModalState = useState(false);
  const senderWalletModalState = useState(false);
  const receiverWalletModalState = useState(false);
  const setSenderWalletModal = senderWalletModalState[1];
  const setReceiverWalletModal = receiverWalletModalState[1];

  const formState = useForm<TransferFormType>({
    balance: 0,
    description: '',
    senderWallet: {} as UserWalletDataResponse,
    receiverWallet: {} as UserWalletDataResponse,
    attachment: {} as CaptureData,
    type: 'TRANSFER',
    created_at: {} as Date,
  });

  const [form, setForm] = formState;

  const handleGetUserWalletsData = useCallback(async () => {
    try {
      const userData = await getUserData();
      const {id: uid} = JSON.parse(userData ?? '') as UserData;
      if (!uid) return Alert.Error('Failed to get user wallet data');
      const walletCollection = firestore().collection('Wallets');
      const snapShots = await walletCollection.doc(uid).collection('userWallets').get();
      const data = snapShots.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as UserWalletDataResponse[];
      console.log('Wallet', data);
      if (data?.length) setUserWalletsData(data);
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      console.log(message);
    }
  }, [getUserData]);

  useEffect(() => {
    void handleGetUserWalletsData();
    console.log('FORM', formState[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm = useCallback(async () => {
    if (!form.balance || !form.receiverWallet || !form.senderWallet) {
      return Alert.Error('Please fill out all required fields.');
    }
    const uploadImageToStorage = async (path: string, imageName: string, uid: string) => {
      const storageRef = storage().ref(`attachment/${uid}/${imageName}`);
      await storageRef.putFile(path);
      const url = await storageRef.getDownloadURL();
      return url;
    };
    try {
      dispatch({type: 'LOADING', value: true});
      const userData = await getUserData();
      const {id: uid} = JSON.parse(userData ?? '') as UserData;
      if (!uid) return Alert.Error("Failed to post user's transaction data");
      const url = form.attachment.path
        ? await uploadImageToStorage(form.attachment.path, form.attachment.name!, uid)
        : '';
      const transactionCollection = firestore().collection('Transactions');
      await transactionCollection
        .doc(uid)
        .collection('userTransactions')
        .add({
          ...form,
          created_at: firestore.FieldValue.serverTimestamp(),
          attachment: url,
        });
    } catch (e) {
      Alert.Error("Failed to post user's transaction data");
    }
    dispatch({type: 'LOADING', value: false});
  }, [form, getUserData]);

  const renderTransferModal = useMemo(
    () => (
      <>
        <AttachmentModal formState={formState} toggleModalState={attachmentModalState} />
        <WalletModal
          formState={formState}
          toggleModalState={senderWalletModalState}
          userWalletsData={userWalletsData}
          onSelect={data => setForm('senderWallet', data)}
          walletType="SENDER"
        />
        <WalletModal
          formState={formState}
          toggleModalState={receiverWalletModalState}
          userWalletsData={userWalletsData}
          onSelect={data => setForm('receiverWallet', data)}
          walletType="RECEIVER"
        />
      </>
    ),
    [
      attachmentModalState,
      formState,
      receiverWalletModalState,
      senderWalletModalState,
      setForm,
      userWalletsData,
    ],
  );

  const renderTransfer = useMemo(
    () => (
      <View style={styles.page}>
        <Balance formState={formState} />
        <InputForm
          formState={formState}
          toggleAttachmentModalState={attachmentModalState}
          toggleCategoryModalState={categoryModalState}
          toggleSenderWalletModalState={setSenderWalletModal}
          toggleReceiverWalletModalState={setReceiverWalletModal}
          variant="TRANSFER"
          onSubmit={handleSubmitForm}
        />
        {renderTransferModal}
      </View>
    ),
    [
      attachmentModalState,
      categoryModalState,
      formState,
      handleSubmitForm,
      renderTransferModal,
      setReceiverWalletModal,
      setSenderWalletModal,
    ],
  );

  return renderTransfer;
};

export default Transfer;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.blue_1,
    justifyContent: 'flex-end',
  },
});
