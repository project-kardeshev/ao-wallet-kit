import { Dispatch, createContext } from 'react';

import { Actions, GlobalState } from './faces';

export const defaultState: GlobalState = {
  activeModal: false,
  activeStrategy: false,
  givenPermissions: [],
  config: {
    permissions: [],
  },
  strategies: [],
};

export const context = createContext<{
  state: GlobalState;
  dispatch: Dispatch<Actions>;
}>(undefined as any);
