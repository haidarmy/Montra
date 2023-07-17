import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Icon} from '@components/icon';
import {Text} from '@components/text';
import {theme} from '@themes';

type HeaderProps = {
  title: string;
};

const Header = ({title}: HeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <Icon type="arrow_left" />
      <Text type="title_3" style={styles.title}>
        {title}
      </Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: theme.white_1,
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
