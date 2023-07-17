import React from 'react';
import {View} from 'react-native';

type GapProps = {
  width?: number;
  height?: number;
};

const Gap = ({height, width}: GapProps) => {
  return <View style={{height: height, width: width}} />;
};

export default Gap;
