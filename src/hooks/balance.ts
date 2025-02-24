import Arweave from 'arweave/node/common';
import { useEffect, useState } from 'react';

import { useGlobalState } from './global';

// TODO: implement tanstack query and AO token balance fetching

/**
 * Balance hook
 */
export function useBalance() {
  const [balance, setBalance] = useState(0);
  const { state } = useGlobalState();

  useEffect(() => {
    (async () => {
      if (!state.activeAddress) return;

      const arweave = new Arweave(
        state?.config?.gatewayConfig || {
          host: 'arweave.net',
          port: 443,
          protocol: 'https',
        },
      );

      const bal = arweave.ar.winstonToAr(
        await arweave.wallets.getBalance(state.activeAddress),
      );

      setBalance(Number(bal));
    })();
  }, [state?.activeAddress, state?.config?.gatewayConfig]);

  return balance;
}
