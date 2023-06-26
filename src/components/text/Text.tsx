import { StyleSheet, Text as TextRN, TextProps as TextRNProps } from 'react-native';
import React, { ReactNode } from 'react';
import { TextType } from '@types';
import { fontFamily, fontSize, lineHeight } from '@utils';
import { ThemeColor } from '@themes';

export interface TextProps extends TextRNProps {
  type: TextType;
  color?: ThemeColor;
  children?: ReactNode;
}

const Text = ({ type, color, children, style, ...props }: TextProps) => {
  return (
    <TextRN
      {...props}
      style={StyleSheet.flatten([
        {
          fontFamily: fontFamily[type],
          fontSize: fontSize[type],
          lineHeight: lineHeight[type],
          color,
        },
        style,
      ])}>
      {children}
    </TextRN>
  );
};

export default Text;
