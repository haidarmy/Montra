import React, {useMemo} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import {Icon, Text} from '@components';
import {theme} from '@themes';
import {fontFamily} from '@utils';

const ExpenseInformation = () => {
  const renderBalance = useMemo(
    () => (
      <View style={{marginBottom: 24, paddingHorizontal: 16}}>
        <Text type="regular_2" textAlign="center" style={{marginBottom: 24}}>
          October
        </Text>
        <Text type="regular_2" textAlign="center" color="white_5">
          Account Balance
        </Text>
        <Text textAlign="center" style={{fontFamily: fontFamily['title_x'], fontSize: 40}}>
          $9400
        </Text>
      </View>
    ),
    [],
  );

  const renderExpenseIncome = useMemo(() => {
    const handleRenderExpenseIncomeContainer = (type: 'INCOME' | 'EXPENSE', value: string) => (
      <View
        style={StyleSheet.flatten([
          styles.expenseIncomeContainer,
          type === 'INCOME' && {backgroundColor: theme.green_1},
          type === 'EXPENSE' && {backgroundColor: theme.red_1},
        ])}>
        <View style={styles.expenseIncomeIcon}>
          {type === 'INCOME' && <Icon type="income" fill={theme.green_1} />}
          {type === 'EXPENSE' && <Icon type="expense" fill={theme.red_1} />}
        </View>
        <View style={{marginLeft: 10}}>
          <Text type="regular_1" color="white_1" style={{marginBottom: 5}}>
            {type === 'INCOME' && 'Income'}
            {type === 'EXPENSE' && 'Expenses'}
          </Text>
          <Text style={{fontFamily: fontFamily['title_2'], fontSize: 22}} color="white_1">
            {value}
          </Text>
        </View>
      </View>
    );
    return (
      <View style={styles.expenseIncome}>
        {handleRenderExpenseIncomeContainer('INCOME', '$5000')}
        {handleRenderExpenseIncomeContainer('EXPENSE', '$1200')}
      </View>
    );
  }, []);

  const renderSpendChart = useMemo(() => {
    const lineData = [
      {value: 10},
      {value: 40},
      {value: 18},
      {value: 36},
      {value: 20},
      {value: 60},
      {value: 54},
      {value: 85},
      {value: 18},
      {value: 40},
      {value: 36},
      {value: 18},
      {value: 40},
      {value: 36},
      {value: 40},
      {value: 36},
      {value: 18},
      {value: 40},
      {value: 36},
      {value: 40},
      {value: 36},
      {value: 40},
      {value: 36},
      {value: 18},
      {value: 40},
      {value: 36},
      {value: 36},
      {value: 0},
      {value: 40},
      {value: 36},
    ];

    return (
      <View>
        <Text type="title_3" style={{paddingLeft: 16}}>
          Spend Frequency
        </Text>
        <LineChart
          data={lineData}
          adjustToWidth
          width={Dimensions.get('window').width}
          curved
          areaChart
          hideDataPoints
          isAnimated
          animationDuration={1200}
          startFillColor={theme.violet_1}
          startOpacity={0.3}
          endOpacity={0.1}
          thickness={4}
          hideAxesAndRules
          hideYAxisText
          yAxisLabelWidth={-5}
          disableScroll
          color={theme.violet_1}
          pointerConfig={{
            autoAdjustPointerLabelPosition: true,
            activatePointersOnLongPress: true,
            showPointerStrip: false,
            pointerColor: theme.red_3,
            pointerLabelComponent: (/* items */) => {
              return (
                <View
                  style={{
                    height: 50,
                    minWidth: 100,
                    backgroundColor: '#282C3E',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                    right: -25,
                  }}>
                  <Text style={{color: 'lightgray', fontSize: 12}}>Sat, May 13</Text>
                  {/* <Text style={{color: 'white', fontWeight: 'bold'}}>Rp{items[0].value}.000</Text> */}
                </View>
              );
            },
          }}
        />
      </View>
    );
  }, []);
  return (
    <View style={{height: '42.5%'}}>
      {renderBalance}
      {renderExpenseIncome}
      {renderSpendChart}
    </View>
  );
};

export default ExpenseInformation;

const styles = StyleSheet.create({
  expenseIncome: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  expenseIncomeContainer: {
    width: Dimensions.get('window').width / 2 - 25,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  expenseIncomeIcon: {
    borderRadius: 16,
    width: 48,
    height: 48,
    backgroundColor: theme.white_1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
