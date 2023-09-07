import React, {useCallback, useMemo} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Text} from '@components/text';
import {theme} from '@themes';

type MonthPickerProps = {
  toggleModalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  monthPickerState: [Month, React.Dispatch<React.SetStateAction<Month>>];
};

export type Month =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

const MonthPicker = ({toggleModalState, monthPickerState}: MonthPickerProps) => {
  const [isVisible, setVisible] = toggleModalState;
  const [selectedMonth, setSelectedMonth] = monthPickerState;

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

  const handleSelectedMonth = useCallback((month: Month) => {
    setSelectedMonth(month);
    setTimeout(() => {
      setVisible(false);
    }, 500);
  }, []);

  return (
    <Modal
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      statusBarTranslucent
      backdropOpacity={0.25}
      isVisible={isVisible}
      animationIn={'pulse'}
      animationOut={'pulse'}
      deviceHeight={Dimensions.get('screen').height}>
      <View style={styles.content}>
        <Text type="title_2" style={{marginBottom: 5}} color="violet_1">
          Month
        </Text>
        <View style={styles.picker}>
          {monthList.map((month, idx) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectedMonth(month)}
              key={idx}
              style={StyleSheet.flatten([
                styles.month,
                selectedMonth === month && {backgroundColor: theme.violet_1, borderRadius: 10},
              ])}>
              <Text type="regular_2" color={selectedMonth === month ? 'white_1' : 'black_4'}>
                {month.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default MonthPicker;

const styles = StyleSheet.create({
  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: theme.white_1,
    padding: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  month: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
});
