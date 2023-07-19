import {Login, Onboarding, SignUp} from '@pages';
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
import {View} from 'react-native';

type OnboardingParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  SetupAccount: undefined;
  AddNewAccount: undefined;
  SignUpSuccess: undefined;
};

//* add pages component dummy
const SetupAccount = () => <View />;
const AddNewAccount = () => <View />;
const SignUpSuccess = () => <View />;

const Stack = createNativeStackNavigator<OnboardingParamList>();

const routes: Array<React.ComponentProps<typeof Stack.Screen>> = [
  {
    name: 'Onboarding',
    component: Onboarding,
  },
  {
    name: 'Login',
    component: Login,
  },
  {
    name: 'SignUp',
    component: SignUp,
  },
  {
    name: 'SetupAccount',
    component: SetupAccount,
  },
  {
    name: 'AddNewAccount',
    component: AddNewAccount,
  },
  {
    name: 'SignUpSuccess',
    component: SignUpSuccess,
  },
];

type StackNavigatorOptions<ParamList extends ParamListBase> = DefaultNavigatorOptions<
  ParamList,
  StackNavigationState<ParamList>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap
>;

const appStackNavigatorProps: Omit<StackNavigatorOptions<OnboardingParamList>, 'children'> = {
  initialRouteName: 'Onboarding',
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
