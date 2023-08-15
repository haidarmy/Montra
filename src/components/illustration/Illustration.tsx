import React from 'react';
import {Il_data, Il_mail, Il_money, Il_plan, Il_receipt} from '@assets';
import {IllustrationType} from '@types';

type IllustrationProps = {
  type: IllustrationType;
  width?: number;
  height?: number;
};

const Illustration = ({type, height = 312, width = 312}: IllustrationProps) => {
  switch (type) {
    case 'data':
      return <Il_data height={height} width={width} />;
    case 'mail':
      return <Il_mail height={height} width={width} />;
    case 'money':
      return <Il_money height={height} width={width} />;
    case 'plan':
      return <Il_plan height={height} width={width} />;
    case 'receipt':
      return <Il_receipt height={height} width={width} />;
  }
};

export default Illustration;
