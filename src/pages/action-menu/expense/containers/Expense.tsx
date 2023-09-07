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
  ExpenseCategoryType,
  ExpenseFormType,
  UserData,
  UserWalletDataResponse,
  TransactionResponse,
} from '@types';
import {useAuthStore} from '@zustand';
import {AttachmentModal, Balance, CategoryModal, InputForm, WalletModal} from '../../template';

const Expense = () => {
  const navigation = useNavigation<TransactionScreenNavigationProp>();
  const route = useRoute<TransactionScreenRouteProp>();
  const transaction = route.params || null;

  const {getItem: getUserData} = useAsyncStorage('user');

  const dispatch = useAuthStore(state => state.dispatch);

  const [userWalletsData, setUserWalletsData] = useState<UserWalletDataResponse[]>([]);
  const attachmentModalState = useState(false);
  const categoryModalState = useState(false);
  const toggleSuccessModalState = useState(false);
  const setSuccessModal = toggleSuccessModalState[1];
  const walletModalState = useState(false);
  const setWalletModalState = walletModalState[1];

  const formState = useForm<ExpenseFormType>(
    (transaction as ExpenseFormType) || {
      balance: 0,
      category: '' as ExpenseCategoryType,
      description: '',
      notes: '',
      wallet: {} as UserWalletDataResponse,
      attachment: {} as CaptureData,
      type: 'EXPENSE',
      created_at: {} as Date,
    },
  );

  const form = formState[0];

  const categories = useMemo(
    (): ExpenseCategoryType[] => ['SUBSCRIPTION', 'SHOPPING', 'FOOD', 'TRANSPORTATION'],
    [],
  );

  const handleGetUserWalletsData = useCallback(async () => {
    try {
      const userData = await getUserData();
      const {id: uid} = JSON.parse(userData ?? '') as UserData;
      if (!uid) return Alert.Error("Failed to get user's wallet data");
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
      newData: ExpenseFormType;
    }) => {
      if (oldData.type !== 'EXPENSE') return;

      if (oldData.wallet.id === newData.wallet.id && oldData.balance === newData.balance) return;
      else if (oldData.wallet.id === newData.wallet.id && oldData.balance !== newData.balance) {
        const walletRef = firestore()
          .collection('Wallets')
          .doc(uid)
          .collection('userWallets')
          .doc(oldData.wallet.id);

        return firestore().runTransaction(async transaction => {
          return transaction.get(walletRef).then(wallet => {
            if (!wallet.exists) {
              throw 'Document does not exist!';
            }

            const newBalance =
              (wallet.data()?.balance as number) + oldData.balance - newData.balance;

            transaction.update(walletRef, {balance: newBalance});
          });
        });
      } else {
        const oldWalletRef = firestore()
          .collection('Wallets')
          .doc(uid)
          .collection('userWallets')
          .doc(oldData.wallet.id);

        const newWalletRef = firestore()
          .collection('Wallets')
          .doc(uid)
          .collection('userWallets')
          .doc(newData.wallet.id);

        return firestore().runTransaction(async transaction => {
          return Promise.all([transaction.get(oldWalletRef), transaction.get(newWalletRef)]).then(
            docs => {
              if (!docs[0].exists || !docs[1].exists) {
                throw 'Document does not exist!';
              }

              const oldWalletBalance = docs[0].data()?.balance as number;
              const newWalletBalance = docs[1].data()?.balance as number;

              transaction.update(oldWalletRef, {balance: oldWalletBalance + oldData.balance});
              transaction.update(newWalletRef, {balance: newWalletBalance - newData.balance});
            },
          );
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
      newData: ExpenseFormType;
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
    async ({uid, walletId, balance}: {uid: string; balance: number; walletId: string}) => {
      const walletCollection = firestore()
        .collection('Wallets')
        .doc(uid)
        .collection('userWallets')
        .doc(walletId);

      return firestore().runTransaction(async transaction => {
        return transaction.get(walletCollection).then(wallet => {
          if (!wallet.exists) {
            throw 'Document does not exist!';
          }

          const newBalance = (wallet.data()?.balance as number) - balance;
          transaction.update(walletCollection, {balance: newBalance});
        });
      });
    },
    [],
  );

  const handlePost = useCallback(
    async (form: ExpenseFormType, uid: string) => {
      await Promise.all([
        handlePostTransaction(uid),
        handleUpdateWalletBalance({
          uid,
          balance: form.balance,
          walletId: form.wallet.id,
        }),
      ]);
    },
    [handlePostTransaction, handleUpdateWalletBalance],
  );

  const handleSubmitForm = useCallback(async () => {
    if (!form.balance || !form.category || !form.wallet.id || !form.notes) {
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

  const renderExpenseModal = useMemo(
    () => (
      <>
        <AttachmentModal formState={formState} toggleModalState={attachmentModalState} />
        <CategoryModal
          formState={formState}
          toggleModalState={categoryModalState}
          categories={categories}
        />
        <WalletModal
          formState={formState}
          toggleModalState={walletModalState}
          userWalletsData={userWalletsData}
        />
      </>
    ),
    [
      attachmentModalState,
      categories,
      categoryModalState,
      formState,
      userWalletsData,
      walletModalState,
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

  const renderExpense = useMemo(
    () => (
      <>
        <View style={styles.page}>
          <Balance formState={formState} />
          <InputForm
            formState={formState}
            toggleAttachmentModalState={attachmentModalState}
            toggleCategoryModalState={categoryModalState}
            toggleWalletModalState={setWalletModalState}
            onSubmit={handleSubmitForm}
          />
          {renderExpenseModal}
        </View>
        {renderSuccessModal}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      formState,
      attachmentModalState,
      categoryModalState,
      handleSubmitForm,
      renderExpenseModal,
      renderSuccessModal,
    ],
  );

  return renderExpense;
};

export default Expense;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.red_1,
    justifyContent: 'flex-end',
  },
});
