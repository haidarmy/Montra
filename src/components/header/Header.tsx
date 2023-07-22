import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Icon} from '@components/icon';
import {Text} from '@components/text';
import {ThemeColor, theme} from '@themes';

type HeaderProps = {
  title: string;
  titleColor?: ThemeColor;
  color?: ThemeColor;
};

const Header = ({title, color = 'white_1', titleColor = 'black_1'}: HeaderProps) => {
  return (
    <View style={StyleSheet.flatten([styles.headerContainer, {backgroundColor: theme[color]}])}>
      <Icon type="arrow_left" fill={theme[titleColor]} />
      <Text type="title_3" color={titleColor} style={styles.title}>
        {title}
      </Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    position: 'absolute',
    right: 0,
    left: 0,
  },
});
