import { DataItem } from 'arconnect';

import { callWindowApi } from '../../utils/arweave';
import { Strategy } from '../Strategy';
import { BrowserWalletStrategy } from './BrowserWallet';

export class WanderStrategy extends BrowserWalletStrategy implements Strategy {
  // @ts-expect-error - overriding for some reason
  public id: 'wander' = 'wander';
  public name = 'Wander';
  public description = 'Non-custodial Arweave wallet for your favorite browser';
  public theme = '235, 224, 255';
  public logo = 'ZafBy2bAp4kj-dFUVJm-EsupwgGhcDJPTpufsa7AYsI';
  public url = 'https://wander.app';

  constructor() {
    super();
  }

  public async isAvailable() {
    const injectedAvailable = await super.isAvailable();

    if (!injectedAvailable) {
      return false;
    }

    return window.arweaveWallet.walletName === 'Wander';
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
