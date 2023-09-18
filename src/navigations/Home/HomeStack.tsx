import * as React from 'react';
import {RouteProp} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import HomeScreen from '@pages/home/screens/HomeScreen';

export type HomeStackParamList = {
  HomeScreen: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
export type HomeScreenRouteProp = RouteProp<HomeStackParamList>;
const Stack = createNativeStackNavigator<HomeStackParamList>();

const routes: Array<React.ComponentProps<typeof Stack.Screen>> = [
  {name: 'HomeScreen', component: HomeScreen},
];

const homeStackNavigatorProps: Omit<React.ComponentProps<typeof Stack.Navigator>, 'children'> = {
  screenOptions: {
    headerShown: false,
    animation: 'none',
  },
};

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" {...homeStackNavigatorProps}>
      {routes.map(routeConfig => (
        <Stack.Screen key={routeConfig.name} {...routeConfig} />
      ))}
    </Stack.Navigator>
  );
}
