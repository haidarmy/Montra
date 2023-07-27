/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState} from 'react';

export const useForm = <T, K extends keyof T>(
  initialValue: T,
): [T, (formType: K | 'reset', formValue?: any) => void] => {
  const [values, setValues] = useState(initialValue);
  return [
    values,
    (formType: K | 'reset', formValue?: any) => {
      if (formType === 'reset') {
        return setValues(initialValue);
      }
      return setValues({...values, [formType]: formValue});
    },
  ];
};
