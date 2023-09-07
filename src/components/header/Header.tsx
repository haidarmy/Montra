import React, {ReactElement} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon} from '@components/icon';
import {Text} from '@components/text';
import {ThemeColor, theme} from '@themes';

type HeaderProps = {
  title: string;
  titleColor?: ThemeColor;
  color?: ThemeColor;
  hidden?: boolean;
  onBack?: () => void;
  rightIcon?: ReactElement;
  rightAction?: () => void;
};

const Header = ({
  title,
  color = 'white_1',
  titleColor = 'black_1',
  hidden,
  onBack,
  rightIcon,
  rightAction,
}: HeaderProps) => {
  if (hidden) return null;
  return (
    <View style={StyleSheet.flatten([styles.headerContainer, {backgroundColor: theme[color]}])}>
      <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.iconWrapper}>
        <Icon type="arrow_left" fill={theme[titleColor]} />
      </TouchableOpacity>
      <Text type="title_3" color={titleColor} style={styles.title}>
        {title}
      </Text>
      {rightAction && rightIcon && (
        <TouchableOpacity activeOpacity={0.7} onPress={rightAction} style={styles.iconWrapper}>
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    textAlign: 'center',
    position: 'absolute',
    right: 0,
    left: 0,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
