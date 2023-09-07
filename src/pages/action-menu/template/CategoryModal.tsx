/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {SetStateAction, useCallback, useMemo} from 'react';
import {Dimensions, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Icon, Text} from '@components';
import {theme} from '@themes';
import {ExpenseCategoryType, IncomeCategoryType} from '@types';
import {getFormattedCategory} from './InputForm';

export interface CategoryModalProps<T> {
  toggleModalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  formState?: [T, (formType: keyof T, formValue?: any) => void];
  customFormState?: [T, React.Dispatch<React.SetStateAction<T>>];
  categories: (ExpenseCategoryType | IncomeCategoryType)[];
}

export const getCategoryColor = (id: ExpenseCategoryType | IncomeCategoryType) => {
  switch (id) {
    case 'SUBSCRIPTION':
      return theme['violet_1'];
    case 'SHOPPING':
      return theme['yellow_1'];
    case 'FOOD':
      return theme['red_1'];
    case 'TRANSPORTATION':
      return theme['blue_1'];
    case 'SALARY':
      return theme['green_1'];
    case 'PASSIVE_INCOME':
      return theme['black_1'];
    default:
      return theme['violet_1'];
  }
};

const CategoryModal = <T extends {category: ExpenseCategoryType | IncomeCategoryType}>({
  formState,
  toggleModalState,
  categories,
  customFormState,
}: CategoryModalProps<T>) => {
  const [form, setForm] = formState || customFormState || [];
  const [isVisible, setModalVisible] = toggleModalState;

  const handleSelectCategory = useCallback(
    (data: string) => {
      if (formState && !customFormState) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setForm && setForm('category' as keyof T & SetStateAction<T>, data);
      } else if (customFormState && !formState) {
        setForm && setForm((form => ({...form, category: data})) as keyof T & SetStateAction<T>);
      }
      setModalVisible(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setForm],
  );

  const handleRenderCategoryList = useMemo(() => {
    return categories.map((category, idx) => (
      <TouchableOpacity
        key={idx}
        activeOpacity={0.7}
        style={{
          ...styles.categoryList,
          borderColor: form?.category === category ? getCategoryColor(category) : theme.white_5,
        }}
        onPress={() => handleSelectCategory(category)}>
        <View
          style={StyleSheet.flatten([
            styles.category,
            {backgroundColor: getCategoryColor(category)},
          ])}
        />
        <Text type="title_3" color="black_3">
          {getFormattedCategory(category)}
        </Text>
      </TouchableOpacity>
    ));
  }, [categories, form?.category, handleSelectCategory]);

  const renderCategoryModal = useMemo(
    () => (
      <Modal
        statusBarTranslucent
        backdropOpacity={0.25}
        style={styles.modal}
        isVisible={isVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        swipeDirection="down">
        <ScrollView style={{...styles.container, flexGrow: 0}}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.closeWrapper}
            onPress={() => setModalVisible(false)}>
            <Icon type="cross" fill={theme.black_1} width={20} />
          </TouchableOpacity>
          {handleRenderCategoryList}
        </ScrollView>
      </Modal>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleRenderCategoryList, isVisible],
  );

  return renderCategoryModal;
};

export default CategoryModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  closeWrapper: {
    top: 10,
    left: Dimensions.get('screen').width / 1.25,
    height: 54,
    width: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  container: {
    backgroundColor: theme.white_1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    position: 'relative',
  },
  categoryList: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 8,
    borderWidth: 3,
    marginBottom: 24,
  },
  category: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
  },
});
