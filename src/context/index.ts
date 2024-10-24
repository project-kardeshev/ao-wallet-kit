import { Dispatch, createContext } from 'react';

import type { Actions, GlobalState } from './faces';

export const defaultState: GlobalState = {
  activeModal: false,
  activeStrategy: false,
  givenPermissions: [],
  config: {
    permissions: [],
  },
  strategies: [],
};

const context = createContext<{
  state: GlobalState;
  dispatch: Dispatch<Actions>;
}>(undefined as any);

export default context;
