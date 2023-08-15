import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {Alert, ModalSuccess} from '@components';
import {useForm} from '@hooks';
import {theme} from '@themes';
import {
  CaptureData,
  ExpenseCategoryType,
  ExpenseFormType,
  UserData,
  UserWalletDataResponse,
} from '@types';
import {useAuthStore} from '@zustand';
import {AttachmentModal, Balance, CategoryModal, InputForm, WalletModal} from '../../template';

const Expense = () => {
  const {getItem: getUserData} = useAsyncStorage('user');
  const dispatch = useAuthStore(state => state.dispatch);

  const [userWalletsData, setUserWalletsData] = useState<UserWalletDataResponse[]>([]);
  const attachmentModalState = useState(false);
  const categoryModalState = useState(false);
  const walletModalState = useState(false);
  const toggleSuccessModalState = useState(false);
  const setWalletModalState = walletModalState[1];
  const setSuccessModal = toggleSuccessModalState[1];

  const formState = useForm<ExpenseFormType>({
    balance: 0,
    category: '' as ExpenseCategoryType,
    description: '',
    wallet: {} as UserWalletDataResponse,
    attachment: {} as CaptureData,
    type: 'EXPENSE',
    created_at: {} as Date,
  });

  const form = formState[0];

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
      console.log('Wallet', data);
      if (data?.length) setUserWalletsData(data);
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      console.log(message);
    }
  }, [getUserData]);

  const categories = useMemo(
    (): ExpenseCategoryType[] => ['SUBSCRIPTION', 'SHOPPING', 'FOOD', 'TRANSPORTATION'],
    [],
  );

  useEffect(() => {
    void handleGetUserWalletsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm = useCallback(async () => {
    if (!form.balance || !form.category || !form.wallet) {
      return; /* Alert.Error('Please fill out all required fields.'); */
    }
    const uploadImageToStorage = async (path: string, imageName: string, uid: string) => {
      const storageRef = storage().ref(`attachment/${uid}/${imageName}`);
      await storageRef.putFile(path);
      const url = await storageRef.getDownloadURL();
      return url;
    };
    try {
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
      setSuccessModal(true);
      setTimeout(() => {
        //* navigate to detail transaction screen
      }, 2000);
    } catch (e) {
      Alert.Error("Failed to post user's transaction data");
    }
    dispatch({type: 'LOADING', value: false});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, getUserData]);

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

  const renderExpense = useMemo(
    () => (
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
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [attachmentModalState, categoryModalState, formState, renderExpenseModal, handleSubmitForm],
  );

  return (
    <>
      {renderExpense}
      <ModalSuccess toggleModalState={toggleSuccessModalState} />
    </>
  );
};

export default Expense;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.red_1,
    justifyContent: 'flex-end',
  },
});
