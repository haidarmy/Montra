/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState} from 'react';

export const useForm = <T>(
  initialValue: T,
): [T, (formType: keyof T | 'reset', formValue?: any) => void] => {
  const [values, setValues] = useState(initialValue);
  return [
    values,
    (formType: keyof T | 'reset', formValue?: any) => {
      if (formType === 'reset') {
        return setValues(initialValue);
      }
      return setValues({...values, [formType]: formValue});
    },
  ];
};
