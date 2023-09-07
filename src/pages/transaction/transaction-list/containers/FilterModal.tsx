/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Button, Icon, Text} from '@components';
import {CategoryModal} from '@pages/action-menu';
import {getCategoryColor} from '@pages/action-menu/template/CategoryModal';
import {getFormattedCategory} from '@pages/action-menu/template/InputForm';
import {ThemeColor, theme} from '@themes';
import {ExpenseCategoryType, IncomeCategoryType} from '@types';
import hexToRgba from 'hex-to-rgba';
import {Category, Filter, FilterOptions, Sort} from './TransactionList';

type FilterModalProps = {
  toggleModalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  filterState: [FilterOptions, React.Dispatch<React.SetStateAction<FilterOptions>>];
  formState: [FilterOptions, React.Dispatch<React.SetStateAction<FilterOptions>>];
};

const FilterModal = ({filterState, formState, toggleModalState}: FilterModalProps) => {
  const [isVisible, setVisible] = toggleModalState;
  const categoryModalState = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = categoryModalState;
  const categoryModalRef = useRef<boolean>();
  const setFilter = filterState[1];
  const [form, setForm] = formState;

  const defaultValues: FilterOptions = {
    filter_by: '' as Filter,
    sort_by: '' as Sort,
    category: '' as Category,
  };

  const handleReset = useCallback(() => {
    setForm(defaultValues);
  }, []);

  const handlePressFilter = useCallback(
    (type: Filter) => {
      if (type === form.filter_by || type === 'TRANSFER') {
        setForm(form => ({...form, category: '' as Category}));
      }
      if (type === form.filter_by) return setForm(form => ({...form, filter_by: '' as Filter}));
      setForm(form => ({...form, filter_by: type}));
    },
    [form],
  );

  const handlePressSort = useCallback(
    (type: Sort) => {
      if (type === form.sort_by) return setForm({...form, sort_by: '' as Sort});
      setForm({...form, sort_by: type});
    },
    [form],
  );

  const handlePressCategory = useCallback(() => {
    setVisible(false);
    setCategoryModalVisible(true);
    categoryModalRef.current = true;
  }, []);

  const handleApplyFilter = useCallback(() => {
    setFilter(form);
    setVisible(false);
  }, [form]);

  useEffect(() => {
    if (categoryModalRef.current && !isCategoryModalVisible) {
      setVisible(true);
      categoryModalRef.current = false;
    }
  }, [isCategoryModalVisible]);

  const handleRenderFilterReset = useMemo(
    () => (
      <View style={styles.filterTransaction}>
        <Text type="title_3">Filter Transaction</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={handleReset}>
          <Text type="regular_2" color="violet_1">
            Reset
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [handleReset],
  );

  const handleRenderFilterBy = useMemo(
    () => (
      <View style={{marginBottom: 24}}>
        <Text type="title_3" style={{marginBottom: 16}}>
          Filter By
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          {['INCOME', 'EXPENSE', 'TRANSFER'].map((type, idx) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handlePressFilter(type as Filter)}
              key={idx}
              style={StyleSheet.flatten([
                styles.filterByPile,
                form.filter_by !== type && {
                  backgroundColor: theme.white_1,
                  borderWidth: 1,
                  borderColor: theme.white_4,
                },
              ])}>
              <Text type="regular_2" color={form.filter_by === type ? 'violet_1' : 'black_1'}>
                {type[0] + type.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),
    [form.filter_by, handlePressFilter],
  );

  const handleRenderSortBy = useMemo(
    () => (
      <View style={{marginBottom: 24}}>
        <Text type="title_3" style={{marginBottom: 16}}>
          Sort By
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
          {['HIGHEST', 'LOWEST', 'NEWEST', 'OLDEST'].map((type, idx) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handlePressSort(type as Sort)}
              key={idx}
              style={StyleSheet.flatten([
                styles.sortByPile,
                form.sort_by !== type && {
                  backgroundColor: theme.white_1,
                  borderWidth: 1,
                  borderColor: theme.white_4,
                },
              ])}>
              <Text type="regular_2" color={form.sort_by === type ? 'violet_1' : 'black_1'}>
                {type[0] + type.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),
    [form.sort_by, handlePressSort],
  );

  const categories = useMemo(
    (): ExpenseCategoryType[] | IncomeCategoryType[] =>
      form.filter_by === 'EXPENSE'
        ? ['SUBSCRIPTION', 'SHOPPING', 'FOOD', 'TRANSPORTATION']
        : ['PASSIVE_INCOME', 'SALARY'],
    [form.filter_by],
  );

  const handleRenderCategory = useMemo(
    () => (
      <TouchableOpacity
        onPress={handlePressCategory}
        activeOpacity={0.7}
        style={{marginBottom: 24}}>
        <Text type="title_3" style={{marginBottom: 16}}>
          Category
        </Text>
        <View style={styles.category}>
          {!form.category && (
            <Text type="title_3" color="black_4">
              Choose Category
            </Text>
          )}
          {form.category && (
            <View style={{flexDirection: 'row'}}>
              <View
                style={StyleSheet.flatten([
                  styles.dotCategory,
                  {backgroundColor: getCategoryColor(form.category)},
                ])}
              />
              <Text type="title_3" style={{color: getCategoryColor(form.category) as ThemeColor}}>
                {getFormattedCategory(form.category)}
              </Text>
            </View>
          )}
          <Icon type="arrow_right_2" fill={theme.violet_1} />
        </View>
      </TouchableOpacity>
    ),
    [form.category, handlePressCategory],
  );

  const handleRenderCategoryModal = useMemo(
    () => (
      <CategoryModal
        customFormState={formState}
        toggleModalState={categoryModalState}
        categories={categories}
      />
    ),
    [categories, categoryModalState, formState],
  );

  const renderFilterModal = useMemo(
    () => (
      <>
        <Modal
          statusBarTranslucent
          backdropOpacity={0.25}
          style={styles.modal}
          isVisible={isVisible}
          onBackdropPress={() => setVisible(false)}
          onSwipeComplete={() => setVisible(false)}
          onBackButtonPress={() => setVisible(false)}
          swipeDirection="down"
          deviceHeight={Dimensions.get('screen').height}>
          <View style={styles.container}>
            <View style={styles.line} />
            {handleRenderFilterReset}
            {handleRenderFilterBy}
            {handleRenderSortBy}
            {form.filter_by && form.filter_by !== 'TRANSFER' && handleRenderCategory}
            <Button
              onPress={handleApplyFilter}
              color="violet_1"
              type="solid"
              tittle="Apply"
              tittleColor="white_1"
            />
          </View>
        </Modal>
        {handleRenderCategoryModal}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      handleRenderCategory,
      handleRenderFilterBy,
      handleRenderFilterReset,
      handleRenderSortBy,
      isVisible,
    ],
  );

  return renderFilterModal;
};

export default FilterModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  line: {
    backgroundColor: theme.violet_4,
    borderRadius: 2,
    width: 36,
    height: 4,
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
  },
  container: {
    backgroundColor: theme.white_1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    justifyContent: 'center',
  },
  filterTransaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterByPile: {
    backgroundColor: hexToRgba(theme.violet_1, 0.1),
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 40,
  },
  sortByPile: {
    backgroundColor: hexToRgba(theme.violet_1, 0.1),
    paddingVertical: 14,
    borderRadius: 40,
    width: Dimensions.get('window').width / 3 - 22,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  category: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  dotCategory: {
    width: 12,
    height: 12,
    borderRadius: 12,
  },
});
