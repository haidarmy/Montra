import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Alert, ModalSuccess} from '@components';
import {useForm} from '@hooks';
import {
  TransactionScreenNavigationProp,
  TransactionScreenRouteProp,
} from '@navigations/Home/TransactionStack';
import {theme} from '@themes';
import {
  CaptureData,
  TransactionResponse,
  TransferFormType,
  UserData,
  UserWalletDataResponse,
} from '@types';
import {useAuthStore} from '@zustand';
import {AttachmentModal, Balance, InputForm, WalletModal} from '../../template';

const Transfer = () => {
  const navigation = useNavigation<TransactionScreenNavigationProp>();
  const route = useRoute<TransactionScreenRouteProp>();
  const transaction = route.params || null;

  const {getItem: getUserData} = useAsyncStorage('user');

  const dispatch = useAuthStore(state => state.dispatch);

  const [userWalletsData, setUserWalletsData] = useState<UserWalletDataResponse[]>([]);
  const attachmentModalState = useState(false);
  const categoryModalState = useState(false);
  const senderWalletModalState = useState(false);
  const receiverWalletModalState = useState(false);
  const setSenderWalletModal = senderWalletModalState[1];
  const setReceiverWalletModal = receiverWalletModalState[1];
  const toggleSuccessModalState = useState(false);
  const setSuccessModal = toggleSuccessModalState[1];

  const formState = useForm<TransferFormType>(
    (transaction as TransferFormType) || {
      balance: 0,
      description: '',
      senderWallet: {} as UserWalletDataResponse,
      receiverWallet: {} as UserWalletDataResponse,
      attachment: {} as CaptureData,
      type: 'TRANSFER',
      created_at: {} as Date,
    },
  );

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
      if (data?.length) setUserWalletsData(data);
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      console.log(message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditTransaction = useCallback(
    async (uid: string) => {
      const updateImageInStorage = async (
        oldAttachment: CaptureData,
        newAttachment: CaptureData,
        uid: string,
      ) => {
        if (oldAttachment.name === newAttachment.name) return oldAttachment.uri;
        if (oldAttachment.name) {
          const storageRef = storage().refFromURL(oldAttachment.uri);
          await storageRef.delete();
        }

        if (newAttachment.name) {
          const storageRef = storage().ref(`attachment/${uid}/${newAttachment.name}`);
          await storageRef.putFile(newAttachment.path!);
          const url = await storageRef.getDownloadURL();
          return url;
        }
      };

      const url = await updateImageInStorage(
        transaction?.attachment as CaptureData,
        form.attachment,
        uid,
      );

      const transactionRef = firestore()
        .collection('Transactions')
        .doc(uid)
        .collection('userTransactions')
        .doc(transaction?.id);

      await transactionRef.set({
        ...form,
        attachment: url ? {name: form.attachment.name, uri: url} : {},
      });
    },
    [form, transaction?.attachment, transaction?.id],
  );

  const handleEditWalletBalance = useCallback(
    async ({
      uid,
      oldData,
      newData,
    }: {
      uid: string;
      oldData: TransactionResponse;
      newData: TransferFormType;
    }) => {
      if (oldData.type !== 'TRANSFER') return;

      const isSenderWalletUnchanged = oldData.senderWallet === newData.senderWallet;
      const isReceiverWalletUnchanged = oldData.receiverWallet === newData.receiverWallet;
      const isBalanceUnchanged = oldData.balance === newData.balance;

      const oldSenderWalletRef = firestore()
        .collection('Wallets')
        .doc(uid)
        .collection('userWallets')
        .doc(oldData.senderWallet.id);

      const newSenderWalletRef = firestore()
        .collection('Wallets')
        .doc(uid)
        .collection('userWallets')
        .doc(newData.senderWallet.id);

      const oldReceiverWalletRef = firestore()
        .collection('Wallets')
        .doc(uid)
        .collection('userWallets')
        .doc(oldData.receiverWallet.id);

      const newReceiverWalletRef = firestore()
        .collection('Wallets')
        .doc(uid)
        .collection('userWallets')
        .doc(newData.receiverWallet.id);

      if (isSenderWalletUnchanged && isReceiverWalletUnchanged && isBalanceUnchanged) return;
      else if (isSenderWalletUnchanged && isReceiverWalletUnchanged && !isBalanceUnchanged) {
        return firestore().runTransaction(async transaction => {
          return Promise.all([
            transaction.get(oldSenderWalletRef),
            transaction.get(oldReceiverWalletRef),
          ]).then(docs => {
            if (!docs[0].exists || !docs[1].exists) {
              throw 'Document does not exist!';
            }

            const senderWalletBalance = docs[0].data()?.balance as number;
            const receiverWalletBalance = docs[1].data()?.balance as number;

            transaction.update(oldSenderWalletRef, {
              balance: senderWalletBalance + oldData.balance - newData.balance,
            });
            transaction.update(oldReceiverWalletRef, {
              balance: receiverWalletBalance - oldData.balance + newData.balance,
            });
          });
        });
      } else if (isSenderWalletUnchanged && !isReceiverWalletUnchanged && isBalanceUnchanged) {
        return firestore().runTransaction(async transaction => {
          return Promise.all([
            transaction.get(oldReceiverWalletRef),
            transaction.get(newReceiverWalletRef),
          ]).then(docs => {
            if (!docs[0].exists || !docs[1].exists) {
              throw 'Document does not exist!';
            }

            const oldReceiverWalletBalance = docs[0].data()?.balance as number;
            const newReceiverWalletBalance = docs[1].data()?.balance as number;

            transaction.update(oldReceiverWalletRef, {
              balance: oldReceiverWalletBalance - oldData.balance,
            });
            transaction.update(newReceiverWalletRef, {
              balance: newReceiverWalletBalance + newData.balance,
            });
          });
        });
      } else if (!isSenderWalletUnchanged && isReceiverWalletUnchanged && isBalanceUnchanged) {
        return firestore().runTransaction(async transaction => {
          return Promise.all([
            transaction.get(oldSenderWalletRef),
            transaction.get(newSenderWalletRef),
          ]).then(docs => {
            if (!docs[0].exists || !docs[1].exists) {
              throw 'Document does not exist!';
            }

            const oldSenderWalletBalance = docs[0].data()?.balance as number;
            const newSenderWalletBalance = docs[1].data()?.balance as number;

            transaction.update(oldSenderWalletRef, {
              balance: oldSenderWalletBalance + oldData.balance,
            });
            transaction.update(newSenderWalletRef, {
              balance: newSenderWalletBalance - newData.balance,
            });
          });
        });
      } else {
        return firestore().runTransaction(async transaction => {
          return Promise.all([
            transaction.get(oldSenderWalletRef),
            transaction.get(oldReceiverWalletRef),
            transaction.get(newSenderWalletRef),
            transaction.get(newReceiverWalletRef),
          ]).then(docs => {
            if (!docs[0].exists || !docs[1].exists || !docs[2].exists || !docs[3].exists) {
              throw 'Document does not exist!';
            }

            const oldSenderWalletBalance = docs[0].data()?.balance as number;
            const oldReceiverWalletBalance = docs[1].data()?.balance as number;
            const newSenderWalletBalance = docs[2].data()?.balance as number;
            const newReceiverWalletBalance = docs[3].data()?.balance as number;

            transaction.update(oldSenderWalletRef, {
              balance: oldSenderWalletBalance + oldData.balance,
            });
            transaction.update(oldReceiverWalletRef, {
              balance: oldReceiverWalletBalance - oldData.balance,
            });
            transaction.update(newSenderWalletRef, {
              balance: newSenderWalletBalance - newData.balance,
            });
            transaction.update(newReceiverWalletRef, {
              balance: newReceiverWalletBalance + newData.balance,
            });
          });
        });
      }
    },
    [],
  );

  const handleEdit = useCallback(
    async ({
      uid,
      oldData,
      newData,
    }: {
      uid: string;
      oldData: TransactionResponse;
      newData: TransferFormType;
    }) => {
      await Promise.all([
        handleEditTransaction(uid),
        handleEditWalletBalance({
          uid,
          oldData,
          newData,
        }),
      ]);
    },
    [handleEditTransaction, handleEditWalletBalance],
  );

  const handlePostTransaction = useCallback(
    async (uid: string) => {
      const uploadImageToStorage = async (path: string, imageName: string, uid: string) => {
        const storageRef = storage().ref(`attachment/${uid}/${imageName}`);
        await storageRef.putFile(path);
        const url = await storageRef.getDownloadURL();
        return url;
      };

      const url = form.attachment.path
        ? await uploadImageToStorage(form.attachment.path, form.attachment.name, uid)
        : '';

      const transactionCollection = firestore().collection('Transactions');
      await transactionCollection
        .doc(uid)
        .collection('userTransactions')
        .add({
          ...form,
          created_at: firestore.FieldValue.serverTimestamp(),
          attachment: url ? {name: form.attachment.name, uri: url} : {},
        });
    },
    [form],
  );

  const handleUpdateWalletBalance = useCallback(
    async ({
      uid,
      senderWalletId,
      receiverWalletId,
      balance,
    }: {
      uid: string;
      balance: number;
      senderWalletId: string;
      receiverWalletId: string;
    }) => {
      const senderWalletCollection = firestore()
        .collection('Wallets')
        .doc(uid)
        .collection('userWallets')
        .doc(senderWalletId);

      const receiverWalletCollection = firestore()
        .collection('Wallets')
        .doc(uid)
        .collection('userWallets')
        .doc(receiverWalletId);

      return firestore().runTransaction(async transaction => {
        return Promise.all([
          transaction.get(senderWalletCollection),
          transaction.get(receiverWalletCollection),
        ]).then(docs => {
          if (!docs[0].exists || !docs[1].exists) {
            throw 'Document does not exist!';
          }

          const senderBalance = docs[0].data()?.balance as number;
          const receiverBalance = docs[1].data()?.balance as number;

          transaction.update(senderWalletCollection, {balance: senderBalance - balance});
          transaction.update(receiverWalletCollection, {balance: receiverBalance + balance});
        });
      });
    },
    [],
  );

  const handlePost = useCallback(
    async (form: TransferFormType, uid: string) => {
      await Promise.all([
        handlePostTransaction(uid),
        handleUpdateWalletBalance({
          uid,
          senderWalletId: form.senderWallet.id,
          receiverWalletId: form.receiverWallet.id,
          balance: form.balance,
        }),
      ]);
    },
    [handlePostTransaction, handleUpdateWalletBalance],
  );

  const handleSubmitForm = useCallback(async () => {
    if (!form.balance || !form.receiverWallet.id || !form.senderWallet.id) {
      return Alert.Error('Please fill out all required fields.');
    }

    try {
      dispatch({type: 'LOADING', value: true});

      const userData = await getUserData();
      const {id: uid} = JSON.parse(userData ?? '') as UserData;
      if (!uid) return Alert.Error("Failed to post user's transaction data");

      transaction
        ? await handleEdit({uid, oldData: transaction, newData: form})
        : await handlePost(form, uid);

      dispatch({type: 'LOADING', value: false});
      setSuccessModal(true);
    } catch (e) {
      dispatch({type: 'LOADING', value: false});
      Alert.Error("Failed to post user's transaction data");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, handleEdit, handlePost, transaction]);

  useEffect(() => {
    void handleGetUserWalletsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTransferModal = useMemo(
    () => (
      <>
        <AttachmentModal formState={formState} toggleModalState={attachmentModalState} />
        <WalletModal
          formState={formState}
          toggleModalState={senderWalletModalState}
          userWalletsData={userWalletsData.filter(wallet => wallet.id !== form.receiverWallet.id)}
          onSelect={data => setForm('senderWallet', data)}
          walletType="SENDER"
        />
        <WalletModal
          formState={formState}
          toggleModalState={receiverWalletModalState}
          userWalletsData={userWalletsData.filter(wallet => wallet.id !== form.senderWallet.id)}
          onSelect={data => setForm('receiverWallet', data)}
          walletType="RECEIVER"
        />
      </>
    ),
    [
      attachmentModalState,
      form.receiverWallet.id,
      form.senderWallet.id,
      formState,
      receiverWalletModalState,
      senderWalletModalState,
      setForm,
      userWalletsData,
    ],
  );

  const renderSuccessModal = useMemo(
    () => (
      <ModalSuccess
        toggleModalState={toggleSuccessModalState}
        message="Transaction has been successfully added"
        onSuccess={() => navigation.reset({index: 0, routes: [{name: 'TransactionScreen'}]})}
      />
    ),
    [navigation, toggleSuccessModalState],
  );

  const renderTransfer = useMemo(
    () => (
      <>
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
        {renderSuccessModal}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      attachmentModalState,
      categoryModalState,
      formState,
      handleSubmitForm,
      renderSuccessModal,
      renderTransferModal,
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
