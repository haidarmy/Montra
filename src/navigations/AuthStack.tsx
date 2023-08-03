import {
  AddNewAccountScreen,
  LoginScreen,
  OnboardingScreen,
  SetupAccountScreen,
  SignUpScreen,
  SignUpSuccessScreen,
} from '@pages';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import * as React from 'react';

type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  SetupAccount: undefined;
  AddNewAccount: undefined;
  SignUpSuccess: undefined;
};

export type AuthScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const Stack = createNativeStackNavigator<AuthStackParamList>();

const routes: Array<React.ComponentProps<typeof Stack.Screen>> = [
  {name: 'Onboarding', component: OnboardingScreen},
  {name: 'Login', component: LoginScreen},
  {name: 'SignUp', component: SignUpScreen},
  {name: 'SetupAccount', component: SetupAccountScreen},
  {name: 'AddNewAccount', component: AddNewAccountScreen},
  {name: 'SignUpSuccess', component: SignUpSuccessScreen},
];

const rootStackNavigatorProps: Omit<React.ComponentProps<typeof Stack.Navigator>, 'children'> = {
  screenOptions: {
    headerShown: false,
    animation: 'none',
  },
};

export default function AuthStack({initialRoute}: {initialRoute: keyof AuthStackParamList}) {
  return (
    <Stack.Navigator initialRouteName={initialRoute} {...rootStackNavigatorProps}>
      {routes.map(routeConfig => (
        <Stack.Screen key={routeConfig.name} {...routeConfig} />
      ))}
    </Stack.Navigator>
  );
}
