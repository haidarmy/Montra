/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, {useCallback, useMemo, useRef} from 'react';
import {Animated, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Icon} from '@components/icon';
import {TabScreenNavigationProp, tabBarRef} from '@navigations';
import {ThemeColor, theme} from '@themes';
import {IconType} from '@types';

export type MenuType = 'INCOME' | 'TRANSFER' | 'EXPENSE';

const ActionButton = () => {
  const navigation = useNavigation<TabScreenNavigationProp>();
  const mode = useRef(new Animated.Value(0)).current;
  const buttonSize = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(buttonSize, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonSize, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(mode, {
        duration: 250,
        toValue: Number(JSON.stringify(mode)) === 0 ? 1 : 0,
        useNativeDriver: false,
      }),
    ]).start();
  }, [buttonSize, mode]);

  const handleSelectedMenu = useCallback(
    (selectedMenu: MenuType) => {
      tabBarRef.current?.setVisible(false);
      switch (selectedMenu) {
        case 'EXPENSE':
          navigation.navigate('Transaction', {screen: 'AddExpenseTransaction'});
          break;
        case 'INCOME':
          navigation.navigate('Transaction', {screen: 'AddIncomeTransaction'});
          break;
        case 'TRANSFER':
          navigation.navigate('Transaction', {screen: 'AddTransferTransaction'});
          break;
        default:
          break;
      }
    },
    [navigation],
  );

  const income = useMemo(
    () => [
      {
        transform: [
          {
            translateX: mode.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -70],
            }),
          },
          {
            translateY: mode.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, -80],
            }),
          },
        ],
      },
    ],
    [mode],
  );

  const transfer = useMemo(
    () => [
      {
        transform: [
          {
            translateX: mode.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0],
            }),
          },
          {
            translateY: mode.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, -130],
            }),
          },
        ],
      },
    ],
    [mode],
  );

  const expense = useMemo(
    () => [
      {
        transform: [
          {
            translateX: mode.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 70],
            }),
          },
          {
            translateY: mode.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, -80],
            }),
          },
        ],
      },
    ],
    [mode],
  );

  const mainSizeStyle = useMemo(
    () => [
      {
        transform: [{scale: buttonSize}],
      },
    ],
    [buttonSize],
  );

  const mainRotation = useMemo(
    () => [
      {
        transform: [
          {
            rotate: mode.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '45deg'],
            }),
          },
        ],
      },
    ],
    [mode],
  );

  const renderMenu = useCallback(
    (
      type: IconType,
      containerTransformations?: Animated.AnimatedProps<StyleProp<ViewStyle>>,
      onPress?: () => void,
      style?: Animated.AnimatedProps<StyleProp<ViewStyle>>,
      iconTransformations?: Animated.AnimatedProps<StyleProp<ViewStyle>>,
    ) => {
      return (
        <Animated.View style={StyleSheet.flatten([containerTransformations, style as any])}>
          <TouchableOpacity onPress={onPress}>
            <Animated.View style={iconTransformations as any}>
              <Icon type={type} fill={theme.white_1} width={26} height={26} />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <View style={{alignItems: 'center'}}>
      {renderMenu(
        'income',
        income,
        () => handleSelectedMenu('INCOME'),
        styles.menuWrapper('green_1'),
      )}
      {renderMenu(
        'transfer',
        transfer,
        () => handleSelectedMenu('TRANSFER'),
        styles.menuWrapper('blue_1'),
      )}
      {renderMenu(
        'expense',
        expense,
        () => handleSelectedMenu('EXPENSE'),
        styles.menuWrapper('red_1'),
      )}
      {renderMenu(
        'plus',
        mainSizeStyle,
        handlePress,
        styles.actionButton('violet_1'),
        mainRotation,
      )}
    </View>
  );
};

export default ActionButton;

export const styles = {
  menuWrapper: (color: ThemeColor): Animated.AnimatedProps<StyleProp<ViewStyle>> => ({
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: theme[color],
  }),
  actionButton: (color: ThemeColor): Animated.AnimatedProps<StyleProp<ViewStyle>> => ({
    marginTop: -5,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme[color],
    bottom: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 5,
  }),
};
