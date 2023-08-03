import {createWithEqualityFn} from 'zustand/traditional';
import {shallow} from 'zustand/shallow';

type UpdateType = 'LOADING' | 'LOGIN' | 'SETUP_ACCOUNT' | 'REGISTERED';

type State = {
  isLogin: boolean;
  isLoading: boolean;
  hadSetupAccount: boolean;
  hadRegistered: boolean;
};

type Actions = {
  dispatch: (action: Action) => void;
};

type Action = {
  type: UpdateType;
  value: boolean;
};

const authReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'LOADING':
      return {isLoading: action.value};
    case 'LOGIN':
      return {isLogin: action.value};
    case 'REGISTERED':
      return {hadRegistered: action.value};
    case 'SETUP_ACCOUNT':
      return {hadSetupAccount: action.value};
    default:
      return state;
  }
};

export const useAuthStore = createWithEqualityFn<State & Actions>()(
  set => ({
    isLoading: true,
    isLogin: false,
    hadSetupAccount: false,
    hadRegistered: false,
    dispatch: (action: Action) => set(state => authReducer(state, action)),
  }),
  shallow,
);
