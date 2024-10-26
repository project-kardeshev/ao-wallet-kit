import { DataItem } from 'arconnect';

import { callWindowApi } from '../../utils/arweave';
import { Strategy } from '../Strategy';
import { BrowserWalletStrategy } from './BrowserWallet';

export class ArConnectStrategy
  extends BrowserWalletStrategy
  implements Strategy
{
  // @ts-expect-error - overriding for some reason
  public id: 'arconnect' = 'arconnect';
  public name = 'ArConnect';
  public description = 'Non-custodial Arweave wallet for your favorite browser';
  public theme = '171, 154, 255';
  public logo = 'tQUcL4wlNj_NED2VjUGUhfCTJ6pDN9P0e3CbnHo3vUE';
  public url = 'https://arconnect.io';

  constructor() {
    super();
  }

  public async isAvailable() {
    const injectedAvailable = await super.isAvailable();

    if (!injectedAvailable) {
      return false;
    }

    return window.arweaveWallet.walletName === 'ArConnect';
  }

  public async addToken(id: string): Promise<void> {
    return await callWindowApi('addToken', [id]);
  }

  public async batchSignDataItem(
    dataItems: DataItem[],
  ): Promise<ArrayBufferLike[]> {
    return await callWindowApi('batchSignDataItem', [dataItems]);
  }
}
