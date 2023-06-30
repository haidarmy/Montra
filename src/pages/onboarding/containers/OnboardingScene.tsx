import {Illustration, Text} from '@components';
import {IllustrationType} from '@types';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

type OnboardingSceneProps = {
  illustration: IllustrationType;
  title: string;
  subTitle: string;
};

const {width} = Dimensions.get('window');

const OnboardingScene = ({illustration, title, subTitle}: OnboardingSceneProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <Illustration type={illustration} />
      </View>
      <View>
        <Text type="title_1" style={styles.title}>
          {title}
        </Text>
        <Text type="regular_1" color="white_6" style={styles.subTitle}>
          {subTitle}
        </Text>
      </View>
    </View>
  );
};

export default OnboardingScene;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingBottom: 120,
    width,
    marginBottom: 10,
  },
  illustration: {flex: 1},
  title: {textAlign: 'center', marginBottom: 16},
  subTitle: {textAlign: 'center'},
});
