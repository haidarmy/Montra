import React from 'react';
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
};

const Header = ({
  title,
  color = 'white_1',
  titleColor = 'black_1',
  hidden,
  onBack,
}: HeaderProps) => {
  if (hidden) return null;
  return (
    <View style={StyleSheet.flatten([styles.headerContainer, {backgroundColor: theme[color]}])}>
      <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backWrapper}>
        <Icon type="arrow_left" fill={theme[titleColor]} />
      </TouchableOpacity>
      <Text type="title_3" color={titleColor} style={styles.title}>
        {title}
      </Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    position: 'absolute',
    right: 0,
    left: 0,
  },
  backWrapper: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
