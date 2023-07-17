import {ThemeColor, theme} from '@themes';
import React, {ReactElement, useCallback, useMemo, useState} from 'react';
import {StyleSheet, TextInput, TextInputProps, TouchableOpacity, View} from 'react-native';

interface InputProps extends TextInputProps {
  borderColorFocus?: ThemeColor;
  borderColorUnfocus?: ThemeColor;
  disabled?: boolean;
  rightIcon?: ReactElement;
  rightIconAction?(): void;
}

const Input = ({
  onChangeText,
  borderColorFocus = 'violet_1',
  borderColorUnfocus = 'white_5',
  disabled,
  secureTextEntry,
  rightIcon,
  rightIconAction,
  style,
  ...props
}: InputProps) => {
  const [border, setBorder] = useState<ThemeColor>('white_6');
  const [visibility, setVisibility] = useState(!secureTextEntry);

  const handleFocus = useCallback(() => setBorder(borderColorFocus), [borderColorFocus]);

  const handleBlur = useCallback(() => setBorder(borderColorUnfocus), [borderColorUnfocus]);

  const handleRightIconAction = useCallback(
    () => (rightIconAction ? rightIconAction : setVisibility(!visibility)),
    [rightIconAction, visibility],
  );

  const handleRenderInputField = useMemo(
    () => (
      <TextInput
        {...props}
        secureTextEntry={!visibility}
        onChangeText={onChangeText}
        editable={!disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={StyleSheet.flatten([
          {borderColor: theme[border]},
          styles.inputContainer,
          !rightIcon && style,
        ])}
      />
    ),
    [border, disabled, handleBlur, handleFocus, onChangeText, props, rightIcon, style, visibility],
  );

  const handleRenderInputWithIcon = useMemo(
    () => (
      <View style={StyleSheet.flatten([styles.iconContainer, rightIcon && style])}>
        {handleRenderInputField}
        <TouchableOpacity activeOpacity={0.7} onPress={handleRightIconAction} style={styles.icon}>
          {rightIcon}
        </TouchableOpacity>
      </View>
    ),
    [handleRenderInputField, handleRightIconAction, rightIcon, style],
  );

  return rightIcon ? handleRenderInputWithIcon : handleRenderInputField;
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: theme.black_2,
    borderWidth: 2,
    borderRadius: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: '1%',
    height: 48,
    width: 48,
  },
});
