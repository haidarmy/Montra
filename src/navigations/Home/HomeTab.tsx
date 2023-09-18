/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {createRef, useCallback, useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CurvedBottomBar, ICurvedBottomBarRef} from 'react-native-curved-bottom-bar';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';
import {ActionButton, Icon, Text} from '@components';
import {theme} from '@themes';
import {IconType} from '@types';
import HomeStack, {HomeStackParamList} from './HomeStack';
import TransactionStack, {TransactionStackParamList} from './TransactionStack';

export type HomeTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Transaction: NavigatorScreenParams<TransactionStackParamList>;
  Budget: undefined;
  Profile: undefined;
};

type RouteName = {name: keyof HomeTabParamList};
type ShowKeys<T extends keyof any> = T extends any ? T : never;
type Name = ShowKeys<keyof HomeTabParamList>;

type CurvedTabRoutes = React.ComponentProps<typeof CurvedBottomBar.Screen>;
type CurvedTabRoutesType = Omit<React.ComponentProps<typeof CurvedBottomBar.Screen>, 'name'>;

type HomeTabRoutesType = CurvedTabRoutesType & RouteName;

export type TabScreenNavigationProp = BottomTabNavigationProp<HomeTabParamList>;

const Home = () => {
  return <HomeStack />;
};

const Transaction = () => {
  return <TransactionStack />;
};
const Budget = () => {
  return <View style={styles.screen1} />;
};

const Profile = () => {
  return <View style={styles.screen2} />;
};

type RenderTabProps = {
  routeName: Name;
  selectedTab: Name;
  navigate: (selectedTab: string) => void;
};

export const tabBarRef = createRef<ICurvedBottomBarRef>();

const HomeTab = () => {
  const _renderIcon = useCallback((routeName: Name, selectedTab: Name) => {
    let icon = '' as IconType;

    switch (routeName) {
      case 'Home':
        icon = 'home';
        break;
      case 'Transaction':
        icon = 'transaction';
        break;
      case 'Budget':
        icon = 'pie_chart';
        break;
      case 'Profile':
        icon = 'user';
        break;
    }

    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 58,
          height: 58,
        }}>
        <Icon type={icon} fill={routeName === selectedTab ? theme.violet_1 : theme.white_6} />
        <Text
          type="tiny"
          color={routeName === selectedTab ? 'violet_1' : 'white_6'}
          style={{marginTop: 4, fontSize: 10}}>
          {routeName}
        </Text>
      </View>
    );
  }, []);

  const renderTabBar = useCallback(
    ({routeName, selectedTab, navigate}: RenderTabProps) => {
      return (
        <TouchableOpacity onPress={() => navigate(routeName)} style={styles.tabbarItem}>
          {_renderIcon(routeName, selectedTab)}
        </TouchableOpacity>
      );
    },
    [_renderIcon],
  );

  const routes: Array<HomeTabRoutesType> = [
    {name: 'Home', position: 'LEFT', component: () => <Home />},
    {name: 'Transaction', position: 'LEFT', component: () => <Transaction />},
    {name: 'Budget', position: 'RIGHT', component: () => <Budget />},
    {name: 'Profile', position: 'RIGHT', component: () => <Profile />},
  ];

  const homeTabNavigatorProps: Omit<
    React.ComponentProps<typeof CurvedBottomBar.Navigator>,
    'children'
  > = useMemo(
    () => ({
      initialRouteName: 'Home',
      screenOptions: {
        headerShown: false,
      },
      ref: tabBarRef,
      type: 'DOWN',
      style: styles.bottomBar,
      shadowStyle: styles.shadow,
      height: 70,
      circleWidth: 55,
      bgColor: theme.white_1,
      renderCircle: () => {
        return <ActionButton />;
      },
      tabBar: renderTabBar as ({
        routeName,
        selectedTab,
        navigate,
      }: {
        routeName: string;
        selectedTab: string;
        navigate: (selectedTab: string) => void;
      }) => JSX.Element,
    }),
    [renderTabBar],
  );

  const renderTabNav = useMemo(
    () => (
      <CurvedBottomBar.Navigator {...homeTabNavigatorProps}>
        {routes.map(routeConfig => (
          <CurvedBottomBar.Screen key={routeConfig.name} {...(routeConfig as CurvedTabRoutes)} />
        ))}
      </CurvedBottomBar.Navigator>
    ),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [homeTabNavigatorProps],
  );

  return renderTabNav;
};

export default React.memo(HomeTab);

export const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#DDDDDD',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomBar: {},
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },
  screen1: {
    flex: 1,
    backgroundColor: '#BFEFFF',
  },
  screen2: {
    flex: 1,
    backgroundColor: '#FFEBCD',
  },
});
