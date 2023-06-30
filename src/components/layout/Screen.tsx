import React, {ReactNode} from 'react';
import {KeyboardAvoidingView, ScrollView, ScrollViewProps, StyleSheet} from 'react-native';

interface ScreenProps extends ScrollViewProps {
  children: ReactNode;
  keyboardShouldAvoidView?: boolean;
}

const Screen = ({
  children,
  bounces = false,
  keyboardShouldAvoidView = true,
  keyboardShouldPersistTaps = 'handled',
  ...props
}: ScreenProps) => {
  return (
    <KeyboardAvoidingView enabled={keyboardShouldAvoidView} style={styles.container}>
      <ScrollView
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
