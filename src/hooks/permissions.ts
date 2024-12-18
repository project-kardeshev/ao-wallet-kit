import { PermissionType } from 'arconnect';
import { useEffect, useRef } from 'react';

import { STRATEGY_STORE } from '../strategy';
import { comparePermissions } from '../utils/arweave';
import { ConnectMsg } from './connection/connect';
import { useGlobalState } from './global';
import { useActiveStrategy } from './strategy';

/**
 * Given permissions hook
 */
export function usePermissions(): PermissionType[] {
  const { state, dispatch } = useGlobalState();
  const strategy = useActiveStrategy();

  // no need to add the strategy to the
  // dependencies of this "useEffect" hook
  // because we don't need to sync the
  // permissions here.
  // the permissions array gets synced anyway
  // in the "useSyncPermissions" hook,
  // mounted in the Provider.
  // here we just sync the permissions on
  // mount, so the hook is up to date when
  // initialised
  useEffect(() => {
    (async () => {
      if (!strategy) return;

      // dispatch to the global state to update
      dispatch({
        type: 'UPDATE_PERMISSIONS',
        payload: await strategy.getPermissions(),
      });
    })();
  }, [dispatch, strategy]);

  return state.givenPermissions;
}

// sync permissions in global state
export function useSyncPermissions() {
  const isReconnecting = useRef(false);
  const { state, dispatch } = useGlobalState();
  const strategy = useActiveStrategy();
  const { permissions: requiredPermissions, ensurePermissions } = state.config;

  useEffect(() => {
    // sync permissions
    async function sync() {
      if (!strategy) {
        fixupDisconnection();
        return dispatch({
          type: 'UPDATE_PERMISSIONS',
          payload: [],
        });
      }

      try {
        const permissions = await strategy.getPermissions();
        const hasPermissions = comparePermissions(
          requiredPermissions,
          permissions,
        );

        dispatch({
          type: 'UPDATE_PERMISSIONS',
          payload: permissions,
        });

        if (requiredPermissions.length === 0 && ensurePermissions) {
          fixupDisconnection();
          return;
        }

        if (!hasPermissions && ensurePermissions && !isReconnecting.current) {
          isReconnecting.current = true;
          await strategy.connect(
            requiredPermissions,
            state.config.appInfo,
            state.config.gatewayConfig,
          );
        }

        if (permissions.length === 0) {
          fixupDisconnection();
        }
      } catch {
        fixupDisconnection();
        dispatch({
          type: 'UPDATE_PERMISSIONS',
          payload: [],
        });
      }
    }

    // sync on connection
    async function msgSync(e: MessageEvent<ConnectMsg>) {
      // validate message
      if (e.data.type !== 'connect_result') {
        return;
      }

      await sync();
    }

    // if a disconnection was not executed appropriately,
    // we need to fix up the global state (active address, etc.)
    // in this function, we check for a broken disconnection,
    // and remove remaining states if necessary
    function fixupDisconnection() {
      // check if disconnection was broken
      // (meaning that some fields has been
      // left in the state)
      if (!state.activeAddress && !state.activeStrategy) {
        return;
      }

      // signal correct disconnection
      dispatch({ type: 'DISCONNECT' });

      // remove active strategy
      localStorage.removeItem(STRATEGY_STORE);
    }

    // initial sync
    sync();

    // events where we need to sync
    addEventListener('arweaveWalletLoaded', sync);
    addEventListener('focus', sync);
    addEventListener('message', msgSync);

    // add sync on address change if
    // there is an active strategy
    let addressChangeSync: any;

    if (strategy && strategy.addAddressEvent) {
      addressChangeSync = strategy.addAddressEvent(sync);
    }

    return () => {
      // remove events
      removeEventListener('arweaveWalletLoaded', sync);
      removeEventListener('focus', sync);
      removeEventListener('message', msgSync);

      // remove sync on address change
      // if there was a listener added
      if (strategy && addressChangeSync && strategy.removeAddressEvent) {
        strategy.removeAddressEvent(addressChangeSync);
      }
    };
  }, [
    strategy,
    dispatch,
    ensurePermissions,
    requiredPermissions,
    state.activeAddress,
    state.activeStrategy,
    state.config.appInfo,
    state.config.gatewayConfig,
  ]);
}
