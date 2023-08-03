/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {Icon, Text} from '@components';
import ActionButton from '@components/action-button/ActionButton';
import {theme} from '@themes';
import {IconType} from '@types';
import React, {useCallback, useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';

type HomeTabParamList = {
  Home: undefined;
  Transaction: undefined;
  Budget: undefined;
  Profile: undefined;
};

type RouteName = {name: keyof HomeTabParamList};
type ShowKeys<T extends keyof any> = T extends any ? T : never;
type Name = ShowKeys<keyof HomeTabParamList>;

type CurvedTabRoutes = React.ComponentProps<typeof CurvedBottomBar.Screen>;
type CurvedTabRoutesType = Omit<React.ComponentProps<typeof CurvedBottomBar.Screen>, 'name'>;

type HomeTabRoutesType = CurvedTabRoutesType & RouteName;

const Home = () => {
  return <View style={styles.screen1} />;
};

const Transaction = () => {
  return <View style={styles.screen2} />;
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
      type: 'DOWN',
      style: styles.bottomBar,
      shadowStyle: styles.shadow,
      height: 70,
      circleWidth: 55,
      bgColor: theme.white_1,
      renderCircle: ({selectedTab, navigate}) => {
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

  return (
    <CurvedBottomBar.Navigator {...homeTabNavigatorProps}>
      {routes.map(routeConfig => (
        <CurvedBottomBar.Screen key={routeConfig.name} {...(routeConfig as CurvedTabRoutes)} />
      ))}
    </CurvedBottomBar.Navigator>
  );
};

export default React.memo(HomeTab);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shadow: {
    shadowColor: '#DDDDDD',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
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
