import React, {useCallback, useMemo} from 'react';
import {ColorValue, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Gap, Icon, Text} from '@components';
import {TransactionScreenNavigationProp} from '@navigations/Home/TransactionStack';
import {getFormattedCategory} from '@pages/action-menu/template/InputForm';
import {ThemeColor, theme} from '@themes';
import {ExpenseCategoryType, IconType, IncomeCategoryType, TransactionResponse} from '@types';
import currency from 'currency.js';
import dayjs from 'dayjs';

type ListItemProps = {
  item: TransactionResponse;
};

const ListItem = ({item}: ListItemProps) => {
  const navigation = useNavigation<TransactionScreenNavigationProp>();

  const getCategoryIcon = useCallback(
    (category: ExpenseCategoryType | IncomeCategoryType | 'TRANSFER'): IconType => {
      switch (category) {
        case 'SUBSCRIPTION':
          return 'recurring_bill';
        case 'FOOD':
          return 'restaurant';
        case 'SHOPPING':
          return 'shopping_bag';
        case 'TRANSPORTATION':
          return 'car';
        case 'SALARY':
          return 'income';
        case 'PASSIVE_INCOME':
          return 'salary';
        case 'TRANSFER':
          return 'transfer';
      }
    },
    [],
  );

  const getCategoryColor = useCallback(
    (
      category: ExpenseCategoryType | IncomeCategoryType | 'TRANSFER',
      type: 'ICON' | 'CONTAINER',
    ): ColorValue => {
      switch (category) {
        case 'SUBSCRIPTION':
          return type === 'ICON' ? theme['violet_1'] : theme['violet_5'];
        case 'FOOD':
          return type === 'ICON' ? theme['red_1'] : theme['red_5'];
        case 'SHOPPING':
          return type === 'ICON' ? theme['yellow_1'] : theme['yellow_5'];
        case 'TRANSPORTATION':
          return type === 'ICON' ? theme['blue_1'] : theme['blue_5'];
        case 'SALARY':
          return type === 'ICON' ? theme['green_1'] : theme['green_5'];
        case 'PASSIVE_INCOME':
          return type === 'ICON' ? theme['black_1'] : theme['black_4'];
        case 'TRANSFER':
          return type === 'ICON' ? theme['blue_1'] : theme['blue_5'];
      }
    },
    [],
  );

  const getBalanceColor = useCallback((type: 'EXPENSE' | 'INCOME' | 'TRANSFER'): ThemeColor => {
    switch (type) {
      case 'EXPENSE':
        return 'red_1';
      case 'INCOME':
        return 'green_1';
      case 'TRANSFER':
        return 'blue_1';
    }
  }, []);

  const handleRenderBalance = useCallback(
    (item: TransactionResponse) => {
      let sign = '';
      if (item.type === 'EXPENSE') {
        sign += '-';
      } else if (item.type === 'INCOME') {
        sign += '+';
      }
      return (
        <Text type="regular_2" color={getBalanceColor(item.type)}>
          {sign} {currency(item.balance, {separator: '.', symbol: 'Rp ', precision: 0}).format()}
        </Text>
      );
    },
    [getBalanceColor],
  );

  const renderListItem = useMemo(
    () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailTransaction', item)}
        activeOpacity={0.7}
        style={styles.container}>
        <View
          style={StyleSheet.flatten([
            styles.categoryIconContainer,
            {
              backgroundColor: getCategoryColor(item.category, 'CONTAINER'),
            },
          ])}>
          <Icon
            type={getCategoryIcon(item.category)}
            fill={getCategoryColor(item.category, 'ICON') as string}
          />
        </View>
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text>{getFormattedCategory(item.category)}</Text>
          <Gap height={10} />
          {item.type !== 'TRANSFER' && (
            <Text type="regular_3" color="white_6">
              {item.notes}
            </Text>
          )}
        </View>
        <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
          {handleRenderBalance(item)}
          <Gap height={10} />
          <Text type="small" color="white_6">
            {dayjs(item.created_at.toDate()).format('hh:mm A')}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [getCategoryColor, getCategoryIcon, handleRenderBalance, item, navigation],
  );

  return renderListItem;
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.white_3,
    padding: 16,
    borderRadius: 24,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginRight: 8,
  },
});
