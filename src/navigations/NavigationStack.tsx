import {
  AddNewAccountScreen,
  LoginScreen,
  OnboardingScreen,
  SetupAccountScreen,
  SignUpScreen,
  SignUpSuccessScreen,
} from '@pages';
import {
  DefaultNavigatorOptions,
  NavigationContainer,
  ParamListBase,
  StackNavigationState,
} from '@react-navigation/native';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import * as React from 'react';

type OnboardingParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  SetupAccount: undefined;
  AddNewAccount: undefined;
  SignUpSuccess: undefined;
};

const Stack = createNativeStackNavigator<OnboardingParamList>();

const routes: Array<React.ComponentProps<typeof Stack.Screen>> = [
  {
    name: 'Onboarding',
    component: OnboardingScreen,
  },
  {
    name: 'Login',
    component: LoginScreen,
  },
  {
    name: 'SignUp',
    component: SignUpScreen,
  },
  {
    name: 'SetupAccount',
    component: SetupAccountScreen,
  },
  {
    name: 'AddNewAccount',
    component: AddNewAccountScreen,
  },
  {
    name: 'SignUpSuccess',
    component: SignUpSuccessScreen,
  },
];

type StackNavigatorOptions<ParamList extends ParamListBase> = DefaultNavigatorOptions<
  ParamList,
  StackNavigationState<ParamList>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap
>;

const appStackNavigatorProps: Omit<StackNavigatorOptions<OnboardingParamList>, 'children'> = {
  initialRouteName: 'SignUpSuccess',
  screenOptions: {
    headerShown: false,
  },
};

export default function NavigationStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator {...appStackNavigatorProps}>
        {routes.map(routeConfig => (
          <Stack.Screen key={routeConfig.name} {...routeConfig} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
