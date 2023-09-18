import React, {ReactElement, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import firestore, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {ActivityIndicator, Alert, Gap, Icon, Text} from '@components';
import usePrevious from '@hooks/usePrevious/UsePrevious';
import {FlashList} from '@shopify/flash-list';
import {theme} from '@themes';
import {ExpenseCategoryType, IncomeCategoryType, TransactionResponse, UserData} from '@types';
import dayjs from 'dayjs';
import deepEqual from 'deep-equal';
import hexToRgba from 'hex-to-rgba';
import FilterModal from './FilterModal';
import ListItem from './ListItem';
import MonthPicker, {Month} from './MonthPicker';

declare global {
  interface Date {
    toDate: () => Date;
  }
}

export type Filter = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type Sort = 'HIGHEST' | 'LOWEST' | 'NEWEST' | 'OLDEST';
export type Category = IncomeCategoryType | ExpenseCategoryType;

export interface FilterOptions {
  filter_by: Filter;
  sort_by: Sort;
  category: Category;
}

const TransactionList = () => {
  const {getItem: getUserData} = useAsyncStorage('user');

  const [refreshing, setRefreshing] = useState(true);

  const [transactions, setTransactions] = useState<TransactionResponse[]>();

  const [lastDocument, setLastDocument] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>>();

  const monthPickerState = useState<Month>(null as unknown as Month);
  const selectedMonth = monthPickerState[0];
  const prevMonth = usePrevious(selectedMonth);

  const monthPickerModalState = useState(false);
  const setMonthPickerModalVisible = monthPickerModalState[1];

  const filterModalState = useState(false);
  const setFilterModalVisible = filterModalState[1];

  const defaultValues: FilterOptions = {
    filter_by: '' as Filter,
    sort_by: '' as Sort,
    category: '' as Category,
  };
  const formState = useState<FilterOptions>(defaultValues);
  const setFilterForm = formState[1];

  const filterOptionsState = useState<FilterOptions>(defaultValues);
  const filter = filterOptionsState[0];
  const prevFilter = usePrevious(filter);

  const monthList = useMemo(
    (): Month[] => [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    [],
  );

  const handlePresFilter = useCallback(() => {
    setFilterForm(filter);
    setFilterModalVisible(true);
  }, [filter, setFilterForm, setFilterModalVisible]);

  const handleQueryTransactionData = useCallback(
    (
      month: Month | null,
      collection: FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>,
    ): Promise<FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>> => {
      const date = month && dayjs(new Date(dayjs().year(), monthList.indexOf(month)));
      const start = date?.startOf('month').toDate();
      const end = date?.endOf('month').toDate();

      let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = collection;

      const isFilterApplied = filter.category || filter.filter_by || filter.sort_by;

      if (month) {
        query = query.where('created_at', '>=', start).where('created_at', '<=', end);
      }
      if (isFilterApplied) {
        if (filter.category) {
          query = query.where('category', '==', filter.category);
        }
        if (filter.filter_by) {
          query = query.where('type', '==', filter.filter_by);
        }
        if (filter.sort_by === 'HIGHEST') {
          query = query.orderBy('balance', 'desc');
        }
        if (filter.sort_by === 'LOWEST') {
          query = query.orderBy('balance', 'asc');
        }
        if (filter.sort_by === 'NEWEST') {
          query = query.orderBy('created_at', 'desc');
        }
        if (filter.sort_by === 'OLDEST') {
          query = query.orderBy('created_at', 'asc');
        }
      }
      if (!filter.sort_by) {
        query = query.orderBy('created_at', 'desc');
      }

      if (lastDocument !== undefined) {
        query = query.startAfter(lastDocument);
      }

      return query.limit(20).get();
    },
    [filter.category, filter.filter_by, filter.sort_by, lastDocument, monthList],
  );

  const handleGetTransactionData = useCallback(
    async (month: Month | null, filter: FilterOptions) => {
      try {
        const userData = await getUserData();
        const {id: uid} = JSON.parse(userData ?? '') as UserData;
        if (!uid) return Alert.Error("Failed to get user's wallet data");
        const transactionCollection = firestore()
          .collection('Transactions')
          .doc(uid)
          .collection('userTransactions');
        const snapShots = await handleQueryTransactionData(month, transactionCollection);
        const data = snapShots.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          category: doc.data().type === 'TRANSFER' ? 'TRANSFER' : doc.data().category,
        })) as TransactionResponse[];
        if ((prevMonth ?? null) !== month || !deepEqual(prevFilter ?? defaultValues, filter)) {
          setTransactions(data);
          setLastDocument(undefined);
        } else {
          setTransactions([...(transactions ?? []), ...data]);
          setLastDocument(snapShots.docs[snapShots.docs.length - 1]);
        }
      } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        console.log(message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lastDocument, prevFilter, prevMonth, transactions],
  );

  const handleGetTransaction = useCallback(async () => {
    setRefreshing(true);
    await handleGetTransactionData(selectedMonth, filter);
    setRefreshing(false);
  }, [filter, handleGetTransactionData, selectedMonth]);

  useEffect(() => {
    void handleGetTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, filter]);

  const handleGetTodayTransaction = useMemo(() => {
    return transactions?.filter(
      transaction =>
        dayjs(transaction.created_at.toDate()).valueOf() < dayjs().valueOf() &&
        dayjs(transaction.created_at.toDate()).valueOf() > dayjs().subtract(1, 'day').valueOf(),
    );
  }, [transactions]);

  const handleGetYesterdayTransaction = useMemo(() => {
    return transactions?.filter(
      transaction =>
        dayjs(transaction.created_at.toDate()).valueOf() < dayjs().subtract(1, 'day').valueOf() &&
        dayjs(transaction.created_at.toDate()).valueOf() > dayjs().subtract(2, 'day').valueOf(),
    );
  }, [transactions]);

  const handleGetPastTransaction = useMemo(() => {
    return transactions?.filter(
      transaction =>
        dayjs(transaction.created_at.toDate()).valueOf() < dayjs().subtract(2, 'day').valueOf(),
    );
  }, [transactions]);

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
    (title: string) => (
      <Text type="title_3" style={{marginBottom: 20}}>
        {title}
      </Text>
    ),
    [],
  );
  const renderListFooter = useMemo(() => () => <Gap height={30} />, []);

  const onEndReachedCalledDuringMomentumRef = useRef(false);

  const handleRenderFlashList = useCallback(
    (data: TransactionResponse[] | undefined, header?: ReactElement, onEndReached?: () => void) => (
      <FlashList
        showsVerticalScrollIndicator={false}
        estimatedItemSize={99}
        data={data}
        renderItem={renderItem}
        contentContainerStyle={{paddingHorizontal: 10}}
        ListHeaderComponent={header}
        ListFooterComponent={renderListFooter}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentumRef.current = true;
        }}
      />
    ),
    [renderItem, renderListFooter],
  );

  const renderTodayTransaction = useMemo(
    () =>
      (handleGetTodayTransaction?.length ?? 0) > 0 &&
      handleRenderFlashList(handleGetTodayTransaction, renderListHeader('Today')),
    [handleGetTodayTransaction, handleRenderFlashList, renderListHeader],
  );

  const renderYesterdayTransaction = useMemo(
    () =>
      (handleGetYesterdayTransaction?.length ?? 0) > 0 &&
      handleRenderFlashList(handleGetYesterdayTransaction, renderListHeader('Yesterday')),
    [handleGetYesterdayTransaction, handleRenderFlashList, renderListHeader],
  );

  const handleTransactionOnReachEnd = useCallback(() => {
    if (
      onEndReachedCalledDuringMomentumRef.current ||
      refreshing ||
      (transactions && transactions.length <= 20)
    )
      return;
    void handleGetTransactionData(selectedMonth, filter);
    onEndReachedCalledDuringMomentumRef.current = true;
  }, [filter, handleGetTransactionData, refreshing, selectedMonth, transactions]);

  const renderPastTransaction = useMemo(
    () =>
      (handleGetPastTransaction?.length ?? 0) > 0 &&
      handleRenderFlashList(
        handleGetPastTransaction,
        renderListHeader('Past'),
        handleTransactionOnReachEnd,
      ),
    [
      handleGetPastTransaction,
      handleRenderFlashList,
      renderListHeader,
      handleTransactionOnReachEnd,
    ],
  );

  const renderTransaction = useMemo(
    () =>
      (selectedMonth || filter.category || filter.filter_by || filter.sort_by) &&
      (transactions?.length ?? 0) > 0 &&
      handleRenderFlashList(transactions, undefined, handleTransactionOnReachEnd),
    [
      selectedMonth,
      filter.category,
      filter.filter_by,
      filter.sort_by,
      transactions,
      handleRenderFlashList,
      handleTransactionOnReachEnd,
    ],
  );

  const renderTopNavigation = useMemo(
    () => (
      <View style={styles.option}>
        <TouchableOpacity
          onPress={() => setMonthPickerModalVisible(true)}
          activeOpacity={0.7}
          style={styles.pile}>
          <Icon type="arrow_down_2" fill={theme.violet_1} />
          <Gap width={4} />
          <Text>{selectedMonth ?? 'Month'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePresFilter} activeOpacity={0.7} style={styles.filter}>
          <Icon type="sort" fill={theme.violet_1} />
          {(!!filter.category || !!filter.filter_by || !!filter.sort_by) && (
            <View style={styles.filterCounter}>
              <Text color="white_1">
                {String(
                  (!!filter.category && 1) + (!!filter.filter_by && 1) + (!!filter.sort_by && 1),
                )}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    ),
    [
      filter.category,
      filter.filter_by,
      filter.sort_by,
      handlePresFilter,
      selectedMonth,
      setMonthPickerModalVisible,
    ],
  );

  const renderTopNavigationModal = useMemo(
    () => (
      <>
        <MonthPicker toggleModalState={monthPickerModalState} monthPickerState={monthPickerState} />
        <FilterModal
          formState={formState}
          toggleModalState={filterModalState}
          filterState={filterOptionsState}
        />
      </>
    ),
    [filterModalState, filterOptionsState, formState, monthPickerModalState, monthPickerState],
  );

  const renderSeparateList = useMemo(
    () =>
      !selectedMonth &&
      !filter.category &&
      !filter.filter_by &&
      !filter.sort_by && (
        <>
          {renderTodayTransaction}
          {renderYesterdayTransaction}
          {renderPastTransaction}
        </>
      ),
    [
      filter.category,
      filter.filter_by,
      filter.sort_by,
      renderPastTransaction,
      renderTodayTransaction,
      renderYesterdayTransaction,
      selectedMonth,
    ],
  );

  const renderLoading = useMemo(
    () => refreshing && <ActivityIndicator color="violet_1" size="small" />,
    [refreshing],
  );

  const renderTransactionList = useMemo(
    () => (
      <View style={styles.page}>
        {renderTopNavigation}
        <TouchableOpacity activeOpacity={0.7} style={styles.bannerReport}>
          <Text color="violet_1">See your financial report</Text>
          <Icon type="arrow_right_2" fill={theme.violet_1} />
        </TouchableOpacity>
        <View style={styles.content}>
          {renderLoading}
          {renderSeparateList}
          {renderTransaction}
        </View>
        {renderTopNavigationModal}
      </View>
    ),
    [
      renderLoading,
      renderSeparateList,
      renderTopNavigation,
      renderTopNavigationModal,
      renderTransaction,
    ],
  );

  return renderTransactionList;
};

export default TransactionList;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.white_1,
  },
  pile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: theme.white_3,
    padding: 4,
    paddingRight: 12,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: theme.white_3,
    padding: 4,
    aspectRatio: 1,
  },
  filterCounter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.violet_1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    padding: 16,
    minHeight: 240,
  },
  bannerReport: {
    paddingHorizontal: 16,
    marginHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: hexToRgba(theme.violet_1, 0.1),
    borderRadius: 8,
  },
});
