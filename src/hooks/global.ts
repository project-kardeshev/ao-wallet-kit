import { useContext, useMemo } from 'react';

import context, { defaultState } from '../context';

export default function useGlobalState() {
  const ctx = useContext(context);

  const state = useMemo(
    () => ctx || { state: defaultState, dispatch: () => {} },
    [ctx],
  );

  return state;
}