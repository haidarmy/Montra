/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, {ReactNode} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AuthStackParamList, HomeTabParamList} from '@navigations';
import {TransactionStackParamList} from '@navigations/Home/TransactionStack';
import {ThemeColor, theme} from '@themes';

interface ScreenProps extends ScrollViewProps {
  children: ReactNode;
  keyboardShouldAvoidView?: boolean;
}

type RootParamList = TransactionStackParamList & AuthStackParamList & HomeTabParamList;

type RootRouteProp = RouteProp<RootParamList>;

type BarStyle = 'light-content' | 'dark-content';

const Screen = ({
  children,
  bounces = false,
  keyboardShouldAvoidView = true,
  keyboardShouldPersistTaps = 'handled',
  ...props
}: ScreenProps) => {
  const route = useRoute<RootRouteProp>();

  const getColorBasedOnRoute = (
    route: keyof RootParamList,
    barStyle?: 'BAR_STYLE',
  ): ThemeColor | BarStyle => {
    switch (route) {
      case 'AddNewAccount':
        return barStyle ? 'light-content' : 'violet_1';
      case 'AddExpenseTransaction':
        return barStyle ? 'light-content' : 'red_1';
      case 'AddIncomeTransaction':
        return barStyle ? 'light-content' : 'green_1';
      case 'AddTransferTransaction':
        return barStyle ? 'light-content' : 'blue_1';
      case 'Onboarding':
      case 'SignUp':
      case 'Login':
      case 'SetupAccount':
      case 'SignUpSuccess':
      case 'TransactionScreen':
      default:
        return barStyle ? 'dark-content' : 'white_1';
    }
  };

  return (
    <KeyboardAvoidingView enabled={keyboardShouldAvoidView} style={styles.container}>
      <StatusBar
        animated
        backgroundColor={theme[getColorBasedOnRoute(route.name) as ThemeColor]}
        barStyle={getColorBasedOnRoute(route.name, 'BAR_STYLE') as BarStyle}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        {...props}
        bounces={bounces}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        contentContainerStyle={styles.contentContainer}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
