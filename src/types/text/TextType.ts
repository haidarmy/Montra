export type TextType =
  | 'title_x'
  | 'title_1'
  | 'title_2'
  | 'title_3'
  | 'regular_1'
  | 'regular_2'
  | 'regular_3'
  | 'small'
  | 'tiny';

export type TextTypeMap<T> = {[K in TextType]: T};
