import React, {useCallback, useLayoutEffect, useMemo, useState} from 'react';
import {Dimensions, Image, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Alert, Button, Gap, Icon, ModalDialog, ModalSuccess, Text} from '@components';
import {
  TransactionScreenNavigationProp,
  TransactionScreenRouteProp,
} from '@navigations/Home/TransactionStack';
import {getFormattedCategory} from '@pages/action-menu/template/InputForm';
import {ThemeColor, theme} from '@themes';
import {TransactionResponse, UserData} from '@types';
import {fontFamily} from '@utils';
import {useAuthStore} from '@zustand';
import currency from 'currency.js';
import dayjs from 'dayjs';
import DetailTransactionHeader from './DetailTransactionHeader';

const DetailTransaction = () => {
  const navigation = useNavigation<TransactionScreenNavigationProp>();
  const dispatch = useAuthStore(state => state.dispatch);
  const {getItem: getUserData} = useAsyncStorage('user');
  const route = useRoute<TransactionScreenRouteProp>();
  const transaction = route.params!;

  const toggleDialogModalState = useState(false);
  const setDialogModalVisible = toggleDialogModalState[1];
  const toggleSuccessModalState = useState(false);
  const setSuccessModalVisible = toggleSuccessModalState[1];

  const [isImageModalVisible, setImageModalVisible] = useState(false);

  useLayoutEffect(() => {
    switch (transaction.type) {
      case 'EXPENSE':
        StatusBar.pushStackEntry({
          backgroundColor: theme.red_1,
          barStyle: 'light-content',
          animated: true,
        });
        break;
      case 'INCOME':
        StatusBar.pushStackEntry({
          backgroundColor: theme.green_1,
          barStyle: 'light-content',
          animated: true,
        });
        break;
      case 'TRANSFER':
        StatusBar.pushStackEntry({
          backgroundColor: theme.blue_1,
          barStyle: 'light-content',
          animated: true,
        });
        break;
      default:
        StatusBar.pushStackEntry({
          backgroundColor: theme.white_1,
          barStyle: 'light-content',
          animated: true,
        });
    }
    return () => {
      StatusBar.pushStackEntry({
        backgroundColor: theme.white_1,
        barStyle: 'dark-content',
        animated: true,
      });
    };
  }, [transaction]);

  const handleDeleteTransaction = useCallback(
    async (uid: string, transaction: TransactionResponse) => {
      const deleteImageFromStorage = async (transaction: TransactionResponse) => {
        if (!transaction.attachment.uri) return;
        const storageRef = storage().refFromURL(transaction.attachment.uri);
        await storageRef.delete();
      };

      const deleteTransaction = async (uid: string, transaction: TransactionResponse) => {
        const transactionRef = firestore()
          .collection('Transactions')
          .doc(uid)
          .collection('userTransactions')
          .doc(transaction.id);

        await transactionRef.delete();
      };

      await Promise.all([deleteImageFromStorage(transaction), deleteTransaction(uid, transaction)]);
    },
    [],
  );

  const handleUpdateWalletBalance = useCallback(async (uid: string, trans: TransactionResponse) => {
    if (trans.type === 'TRANSFER') {
      const senderWalletCollection = firestore()
        .collection('Wallets')
        .doc(uid)
        .collection('userWallets')
        .doc(trans.senderWallet.id);

      const receiverWalletCollection = firestore()
        .collection('Wallets')
        .doc(uid)
        .collection('userWallets')
        .doc(trans.receiverWallet.id);

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

          transaction.update(senderWalletCollection, {
            balance: senderBalance + trans.balance,
          });
          transaction.update(receiverWalletCollection, {
            balance: receiverBalance - trans.balance,
          });
        });
      });
    } else {
      const walletCollection = firestore()
        .collection('Wallets')
        .doc(uid)
        .collection('userWallets')
        .doc(trans.wallet.id);

      return firestore().runTransaction(async transaction => {
        return transaction.get(walletCollection).then(wallet => {
          if (!wallet.exists) {
            throw 'Document does not exist!';
          }

          const newBalance =
            trans.type === 'EXPENSE'
              ? (wallet.data()?.balance as number) + trans.balance
              : (wallet.data()?.balance as number) - trans.balance;
          transaction.update(walletCollection, {balance: newBalance});
        });
      });
    }
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      dispatch({type: 'LOADING', value: true});
      const userData = await getUserData();
      const {id: uid} = JSON.parse(userData ?? '') as UserData;
      if (!uid) return Alert.Error('Failed to delete transaction');

      await Promise.all([
        handleDeleteTransaction(uid, transaction),
        handleUpdateWalletBalance(uid, transaction),
      ]);

      setDialogModalVisible(false);
      dispatch({type: 'LOADING', value: false});
      setSuccessModalVisible(true);
    } catch (error) {
      dispatch({type: 'LOADING', value: false});
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      console.log(message);
      console.log('error');
      Alert.Error("Failed to delete user's transaction data");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDeleteTransaction, handleUpdateWalletBalance, transaction]);

  const handleAttachmentViewer = useMemo(
    () =>
      transaction.attachment.uri && (
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          backdropOpacity={0.55}
          deviceHeight={Dimensions.get('screen').height}
          onBackdropPress={() => setImageModalVisible(false)}
          onSwipeComplete={() => setImageModalVisible(false)}
          onBackButtonPress={() => setImageModalVisible(false)}
          isVisible={isImageModalVisible}
          style={{margin: 0}}>
          <StatusBar barStyle="dark-content" backgroundColor="rgb(0,0,0)" />
          <ImageViewer
            useNativeDriver
            onCancel={() => setImageModalVisible(false)}
            renderIndicator={() => <></>}
            imageUrls={[
              {
                url: transaction.attachment.uri,
              },
            ]}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setImageModalVisible(false)}
            style={styles.closeWrapper}>
            <Icon type="cross" fill={theme.white_1} width={24} height={24} />
          </TouchableOpacity>
        </Modal>
      ),
    [isImageModalVisible, transaction.attachment],
  );

  const transactionNotes = transaction.type !== 'TRANSFER' && transaction.notes;
  const transactionWallet = transaction.type !== 'TRANSFER' && transaction.wallet.cardHolderName;
  const transactionSenderWallet =
    transaction.type === 'TRANSFER' && transaction.senderWallet.cardHolderName;
  const transactionReceiverWallet =
    transaction.type === 'TRANSFER' && transaction.receiverWallet.cardHolderName;

  const handleRenderUpper = useMemo(
    () => (
      <View
        style={StyleSheet.flatten([
          transaction.type === 'EXPENSE' && {backgroundColor: theme.red_1},
          transaction.type === 'INCOME' && {backgroundColor: theme.green_1},
          transaction.type === 'TRANSFER' && {backgroundColor: theme.blue_1},
          styles.contentUpper,
        ])}>
        <Text style={styles.balance}>
          {currency(transaction.balance, {separator: '.', symbol: 'Rp ', precision: 0}).format()}
        </Text>
        <Gap height={10} />
        {transaction.type !== 'TRANSFER' && (
          <Text type="regular_1" color="white_1">
            {transaction.notes}
          </Text>
        )}
        <Gap height={5} />
        <Text type="small" color="white_1">
          {dayjs(transaction.created_at.toDate()).format('dddd D MMMM YYYY hh:mm a')}
        </Text>
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transaction.balance, transaction.created_at, transactionNotes, transaction.type],
  );

  const renderContentBox = useMemo(
    () => (
      <View style={styles.contentBox}>
        <View style={{alignItems: 'center'}}>
          <Text color="white_6" textAlign="center" style={{marginBottom: 5}}>
            Type
          </Text>
          <Text type="regular_2">{getFormattedCategory(transaction.type)}</Text>
        </View>
        {transaction.type !== 'TRANSFER' && (
          <>
            <View style={{alignItems: 'center'}}>
              <Text color="white_6" textAlign="center" style={{marginBottom: 5}}>
                Category
              </Text>
              <Text type="regular_2">{getFormattedCategory(transaction.category)}</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text color="white_6" textAlign="center" style={{marginBottom: 5}}>
                Wallet
              </Text>
              <Text type="regular_2">{transaction.wallet.cardHolderName}</Text>
            </View>
          </>
        )}
        {transaction.type === 'TRANSFER' && (
          <>
            <View style={{alignItems: 'center'}}>
              <Text color="white_6" textAlign="center" style={{marginBottom: 5}}>
                From
              </Text>
              <Text type="regular_2">{transaction.senderWallet.cardHolderName}</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text color="white_6" textAlign="center" style={{marginBottom: 5}}>
                To
              </Text>
              <Text type="regular_2">{transaction.receiverWallet.cardHolderName}</Text>
            </View>
          </>
        )}
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      transaction.category,
      transactionWallet,
      transactionSenderWallet,
      transactionReceiverWallet,
      transaction.type,
    ],
  );

  const handleRenderMain = useMemo(
    () => (
      <View style={{paddingHorizontal: 16, flex: 1}}>
        {renderContentBox}
        <DashedLine
          dashGap={10}
          dashLength={10}
          dashColor={theme.white_5}
          style={{marginLeft: 5, marginBottom: 10}}
        />
        {transaction.description && (
          <>
            <Text type="title_3" color="white_6" style={{marginBottom: 10}}>
              Description
            </Text>
            <Text style={{marginBottom: 20}}>{transaction.description}</Text>
          </>
        )}
        {transaction.attachment.uri && (
          <>
            <Text type="title_3" color="white_6" style={{marginBottom: 10}}>
              Attachment
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setImageModalVisible(true)}>
              <Image
                source={{
                  uri: transaction.attachment.uri,
                }}
                width={Dimensions.get('screen').width - 32}
                height={120}
                style={{borderRadius: 8}}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    ),
    [renderContentBox, transaction.attachment, transaction.description],
  );

  const handlePressEdit = useCallback(() => {
    if (transaction.type === 'EXPENSE') {
      navigation.navigate('AddExpenseTransaction', transaction);
    } else if (transaction.type === 'INCOME') {
      navigation.navigate('AddIncomeTransaction', transaction);
    } else if (transaction.type === 'TRANSFER') {
      navigation.navigate('AddTransferTransaction', transaction);
    }
  }, [navigation, transaction]);

  const handleRenderDetailTransactionPage = useMemo(
    () => (
      <View style={{flex: 1}}>
        {handleRenderUpper}
        {handleRenderMain}
        <Button
          type="solid"
          color="violet_1"
          tittle="Edit"
          tittleColor="white_1"
          style={{marginHorizontal: 16, marginBottom: 20}}
          onPress={handlePressEdit}
        />
        {handleAttachmentViewer}
      </View>
    ),
    [handleAttachmentViewer, handleRenderMain, handleRenderUpper, handlePressEdit],
  );

  const handleHeaderColor = useMemo((): ThemeColor => {
    if (transaction.type === 'EXPENSE') return 'red_1';
    if (transaction.type === 'INCOME') return 'green_1';
    if (transaction.type === 'TRANSFER') return 'blue_1';
    return 'white_1';
  }, [transaction.type]);

  const renderDetailTransaction = useMemo(
    () => (
      <>
        <DetailTransactionHeader
          headerColor={handleHeaderColor}
          onRightAction={() => setDialogModalVisible(true)}
        />
        {handleRenderDetailTransactionPage}
        <ModalDialog
          toggleModalState={toggleDialogModalState}
          leftAction={() => setDialogModalVisible(false)}
          rightAction={handleDelete}
        />
        <ModalSuccess
          toggleModalState={toggleSuccessModalState}
          message="Transaction has been successfully removed"
          onSuccess={() => navigation.reset({index: 0, routes: [{name: 'TransactionScreen'}]})}
        />
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      handleDelete,
      handleHeaderColor,
      handleRenderDetailTransactionPage,
      navigation,
      toggleDialogModalState,
      toggleSuccessModalState,
    ],
  );

  return renderDetailTransaction;
};

export default DetailTransaction;

const styles = StyleSheet.create({
  balance: {
    fontFamily: fontFamily['title_1'],
    fontSize: 48,
    color: theme['white_1'],
  },
  closeWrapper: {
    flexDirection: 'row-reverse',
    position: 'absolute',
    top: 30,
    right: 15,
  },
  contentBox: {
    width: '100%',
    backgroundColor: theme.white_1,
    height: 70,
    marginTop: -40,
    marginBottom: 16,
    alignSelf: 'center',
    borderRadius: 12,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contentUpper: {
    height: 240,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
});
