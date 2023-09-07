import * as React from 'react';
import {RouteProp, getFocusedRouteNameFromRoute, useRoute} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  DetailTransactionScreen,
  ExpenseScreen,
  IncomeScreen,
  TransactionListScreen,
  TransferScreen,
} from '@pages';
import {TransactionResponse} from '@types';
import {tabBarRef} from './HomeTab';

export type TransactionStackParamList = {
  TransactionScreen: undefined;
  DetailTransaction: TransactionResponse;
  AddExpenseTransaction: TransactionResponse | undefined;
  AddIncomeTransaction: TransactionResponse | undefined;
  AddTransferTransaction: TransactionResponse | undefined;
};

export type TransactionScreenNavigationProp = NativeStackNavigationProp<TransactionStackParamList>;
export type TransactionScreenRouteProp = RouteProp<TransactionStackParamList>;
const Stack = createNativeStackNavigator<TransactionStackParamList>();

const routes: Array<React.ComponentProps<typeof Stack.Screen>> = [
  {name: 'TransactionScreen', component: TransactionListScreen},
  {name: 'DetailTransaction', component: DetailTransactionScreen},
  {name: 'AddExpenseTransaction', component: ExpenseScreen},
  {name: 'AddIncomeTransaction', component: IncomeScreen},
  {name: 'AddTransferTransaction', component: TransferScreen},
];

const rootStackNavigatorProps: Omit<React.ComponentProps<typeof Stack.Navigator>, 'children'> = {
  screenOptions: {
    headerShown: false,
    animation: 'none',
  },
};

export default function TransactionStack() {
  const route = useRoute();

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const routes: (keyof TransactionStackParamList)[] = [
      'AddExpenseTransaction',
      'AddIncomeTransaction',
      'AddTransferTransaction',
      'DetailTransaction',
    ];
    if (routes.includes(routeName as keyof TransactionStackParamList)) {
      tabBarRef?.current?.setVisible(false);
    } else {
      tabBarRef?.current?.setVisible(true);
    }
  }, [route]);

  return (
    <Stack.Navigator initialRouteName="TransactionScreen" {...rootStackNavigatorProps}>
      {routes.map(routeConfig => (
        <Stack.Screen key={routeConfig.name} {...routeConfig} />
      ))}
    </Stack.Navigator>
  );
}
