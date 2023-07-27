/* eslint-disable @typescript-eslint/no-unsafe-return */
import {ThemeColor, theme} from '@themes';
import {InputState} from '@types';
import {fontFamily} from '@utils';
import React, {ReactElement, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, TextInput, TextInputProps, TouchableOpacity, View} from 'react-native';

interface InputProps extends TextInputProps {
  borderColorFocus?: ThemeColor;
  borderColorUnfocus?: ThemeColor;
  disabled?: boolean;
  rightIcon?: ReactElement;
  rightIconAction?(): void;
  maxLength?: number;
  inputState?: [InputState, React.Dispatch<React.SetStateAction<InputState>>];
}

const Input = ({
  onChangeText,
  borderColorFocus = 'violet_1',
  borderColorUnfocus = 'white_5',
  disabled,
  secureTextEntry,
  rightIcon,
  rightIconAction,
  maxLength = 24,
  inputState,
  style,
  ...props
}: InputProps) => {
  const [border, setBorder] = useState<ThemeColor>('white_5');
  const [visibility, setVisibility] = useState(!secureTextEntry);
  const [input, setInput] = inputState || [];

  const handleFocus = useCallback(() => {
    setBorder(borderColorFocus);
  }, [borderColorFocus]);

  const handleBlur = useCallback(() => {
    setBorder(borderColorUnfocus);
  }, [borderColorUnfocus]);

  const handleError = useCallback(() => {
    if (!input) return;
    input === 'ERROR' && setBorder('red_1');
    input === 'NO_ERROR' && setBorder(borderColorUnfocus);
  }, [borderColorUnfocus, input]);

  useEffect(() => {
    handleError();
  }, [handleError]);

  const handleRightIconAction = useCallback(
    () => (rightIconAction ? rightIconAction : setVisibility(!visibility)),
    [rightIconAction, visibility],
  );

  const handleRenderInputField = useMemo(
    () => (
      <TextInput
        {...props}
        onPressOut={() => {
          setInput && setInput('NO_ERROR');
        }}
        secureTextEntry={!visibility}
        onChangeText={onChangeText}
        editable={!disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxLength={maxLength}
        style={StyleSheet.flatten([
          {borderColor: theme[border]},
          styles.input,
          !rightIcon && style,
        ])}
      />
    ),
    [
      props,
      visibility,
      onChangeText,
      disabled,
      handleFocus,
      handleBlur,
      maxLength,
      border,
      rightIcon,
      style,
      setInput,
    ],
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
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: theme.black_2,
    borderWidth: 1.5,
    borderRadius: 16,
    fontFamily: fontFamily['regular_3'],
    fontSize: 16,
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
