import React from 'react';
import {ActivityIndicator as ActivityIndicatorRN, StyleSheet, View} from 'react-native';
import {ThemeColor, theme} from '@themes';

type ActivityIndicatorProps = {
  color: ThemeColor;
  size: 'large' | 'small';
};

const ActivityIndicator = ({color, size}: ActivityIndicatorProps) => {
  return (
    <View style={styles.loadingWrapper}>
      <ActivityIndicatorRN color={theme[color]} animating size={size} />
    </View>
  );
};

export default ActivityIndicator;

const styles = StyleSheet.create({
  loadingWrapper: {
    position: 'absolute',
    top: 15,
    alignSelf: 'center',
    padding: 8,
    borderRadius: 36,
    backgroundColor: theme.white_1,
    shadowColor: '#000',
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 3,
  },
});
