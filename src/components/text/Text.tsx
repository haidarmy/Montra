import React, {ReactNode} from 'react';
import {StyleSheet, Text as TextRN, TextProps as TextRNProps, TextStyle} from 'react-native';
import {ThemeColor, theme} from '@themes';
import {TextType} from '@types';
import {fontFamily, fontSize, lineHeight} from '@utils';

export interface TextProps extends TextRNProps {
  type?: TextType;
  color?: ThemeColor;
  children?: ReactNode;
  textAlign?: TextStyle['textAlign'];
}

const Text = ({
  type = 'regular_1',
  color = 'black_1',
  textAlign,
  children,
  style,
  ...props
}: TextProps) => {
  return (
    <TextRN
      {...props}
      style={StyleSheet.flatten([
        {
          fontFamily: fontFamily[type],
          fontSize: fontSize[type],
          lineHeight: !style ? lineHeight[type] : undefined,
          color: theme[color],
          textAlign: textAlign,
        },
        style,
      ])}>
      {children}
    </TextRN>
  );
};

export default Text;
