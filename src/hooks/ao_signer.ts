import { AoSigner } from '@project-kardeshev/ao-sdk/web';
import { useEffect, useState } from 'react';

import { useActiveStrategy } from './strategy';

/**
 * @description Hook to get the AoSigner instance from the active strategy
 * @returns {AoSigner | undefined}
 * @example
 * ```ts
 * import { useAoSigner } from '@project-kardeshev/ao-wallet-kit';
 * const aoSigner = useAoSigner();
 * ```
 */
export function useAoSigner() {
  const strategy = useActiveStrategy();
  const [signer, setSigner] = useState<AoSigner | undefined>();

  useEffect(() => {
    if (!strategy) {
      setSigner(undefined);
      return;
    }
    strategy.createDataItemSigner().then((s) => setSigner(s));
  }, [strategy]);

  return signer;
}
