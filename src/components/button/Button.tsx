import {Text} from '@components/text';
import {ThemeColor, theme} from '@themes';
import React from 'react';
import {StyleSheet, TouchableOpacity, TouchableOpacityProps} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  type: 'solid' | 'outline';
  color: ThemeColor;
  tittleColor?: ThemeColor;
  tittle?: string;
}

const Button = ({type, color, tittle, tittleColor = 'black_1'}: ButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={StyleSheet.flatten([
        styles.button,
        type === 'solid' && {backgroundColor: theme[color]},
        type === 'outline' && {borderColor: theme[color]},
      ])}>
      {!!tittle && (
        <Text type="title_3" color={tittleColor}>
          {tittle}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 17,
    borderRadius: 16,
    marginBottom: 16,
  },
});
