import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {TabActions, useNavigation} from '@react-navigation/native';
import {Alert, Gap, Text} from '@components';
import {FlashList} from '@shopify/flash-list';
import {theme} from '@themes';
import {TransactionResponse, UserData} from '@types';
import hexToRgba from 'hex-to-rgba';
import ListItem from './ListItem';

const RecentTransaction = () => {
  const {getItem: getUserData} = useAsyncStorage('user');
  const navigation = useNavigation();

  const [transactions, setTransactions] = useState<TransactionResponse[]>();

  const handleGetTransactionData = useCallback(
    async () => {
      try {
        const userData = await getUserData();
        const {id: uid} = JSON.parse(userData ?? '') as UserData;
        if (!uid) return Alert.Error("Failed to get user's wallet data");
        const transactionRef = firestore()
          .collection('Transactions')
          .doc(uid)
          .collection('userTransactions');
        const snapShots = await transactionRef.limit(5).get();
        const data = snapShots.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          category: doc.data().type === 'TRANSFER' ? 'TRANSFER' : doc.data().category,
        })) as TransactionResponse[];
        data.length && setTransactions(data);
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        console.log(message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions],
  );

  useEffect(() => {
    void handleGetTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const renderItem = useCallback(
    ({item}: Record<'item', TransactionResponse>) => (
      <View>
        <ListItem item={item} />
        <Gap height={15} />
      </View>
    ),
    [],
  );

  const renderListHeader = useCallback(
    () => (
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 20,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text type="title_3">Recent Transaction</Text>
        <TouchableOpacity
          onPress={() => navigation.dispatch(TabActions.jumpTo('Transaction'))}
          activeOpacity={0.7}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 40,
            backgroundColor: hexToRgba(theme.violet_1, 0.1),
          }}>
          <Text type="regular_1" color="violet_1">
            See All
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [navigation],
  );
  const renderListFooter = useMemo(() => () => <Gap height={30} />, []);

  const renderRecentTransaction = useMemo(
    () => (
      <View style={styles.list}>
        <FlashList
          showsVerticalScrollIndicator={false}
          estimatedItemSize={5}
          data={transactions}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: 10}}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderListFooter}
        />
      </View>
    ),
    [renderItem, renderListFooter, renderListHeader, transactions],
  );
  return renderRecentTransaction;
};

export default RecentTransaction;

const styles = StyleSheet.create({
  list: {padding: 16},
});
