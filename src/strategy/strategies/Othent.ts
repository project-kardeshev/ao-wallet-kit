import { Othent, AppInfo as OthentAppInfo, OthentOptions } from '@othent/kms';
import { AoSigner } from '@project-kardeshev/ao-sdk/web';
import {
  DataItem,
  DispatchResult,
  GatewayConfig,
  PermissionType,
} from 'arconnect';
import { AppInfo } from 'arweave-wallet-connector';
import { SignatureOptions } from 'arweave/node/lib/crypto/crypto-interface';
import Transaction from 'arweave/web/lib/transaction';

import { Strategy } from '../Strategy';

type ListenerFunction = (address: string) => void;

export class OthentStrategy implements Strategy {
  id: 'othent' = 'othent';
  name = 'Othent';
  description =
    'Othent JS SDK to manage Arweave wallets backed by Auth0 and Google Key Management Service.';
  theme = '35, 117, 239';
  logo = '33nBIUNlGK4MnWtJZQy9EzkVJaAd7WoydIKfkJoMvDs';
  url = 'https://othent.io';

  #othent: Othent | null = null;
  #othentOptions: OthentOptions | null = null;
  #addressListeners: ListenerFunction[] = [];

  constructor() {}

  public __overrideOthentOptions(othentOptions: OthentOptions) {
    this.#othentOptions = othentOptions;
  }

  #othentInstance() {
    if (this.#othent) return this.#othent;

    try {
      const appInfo: OthentAppInfo = {
        name: typeof location === 'undefined' ? 'UNKNOWN' : location.hostname,
        version: 'AOWalletKit',
        env: '',
      };

      this.#othent = new Othent({
        appInfo,
        persistLocalStorage: true,
        ...this.#othentOptions,
      });

      // Note the cleanup function is not used here, which could cause issues with Othent is re-instantiated on the same tab.
      this.#othent.addEventListener('auth', (userDetails) => {
        for (const listener of this.#addressListeners) {
          listener(
            (userDetails?.walletAddress || undefined) as unknown as string,
          );
        }
      });

      if (this.#othentOptions?.persistLocalStorage) {
        // Note the cleanup function is not used here, which could cause issues with Othent is re-instantiated on the same tab.
        this.#othent.startTabSynching();
      }
    } catch (err) {
      throw new Error(
        `[Arweave Wallet Kit] ${(err instanceof Error && err.message) || err}`,
      );
    }

    return this.#othent;
  }

  public async isAvailable() {
    try {
      return !!this.#othentInstance();
    } catch {
      return false;
    }
  }

  public async connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig,
  ) {
    const othent = this.#othentInstance();

    if (permissions) {
      console.warn(
        '[Arweave Wallet Kit] Othent implicitly requires all permissions. Your `permissions` parameter will be ignored.',
      );
    }

    return othent
      .connect(
        undefined,
        appInfo
          ? ({ ...othent.appInfo, ...appInfo } as OthentAppInfo)
          : undefined,
        gateway,
      )
      .then(() => undefined);
  }

  public async disconnect() {
    return this.#othentInstance().disconnect();
  }

  public async getActiveAddress() {
    return this.#othentInstance().getActiveAddress();
  }

  public async getActivePublicKey() {
    return this.#othentInstance().getActivePublicKey();
  }

  public async getAllAddresses() {
    return this.#othentInstance().getAllAddresses();
  }

  public async getWalletNames() {
    return this.#othentInstance().getWalletNames();
  }

  public async userDetails() {
    return this.#othentInstance().getUserDetails();
  }

  public async sign(transaction: Transaction, options?: SignatureOptions) {
    if (options) {
      console.warn(
        '[Arweave Wallet Kit] Othent does not support `sign()` options',
      );
    }

    return this.#othentInstance().sign(transaction);
  }

  public async dispatch(transaction: Transaction): Promise<DispatchResult> {
    return this.#othentInstance().dispatch(transaction);
  }

  public signDataItem(p: DataItem): Promise<ArrayBuffer> {
    return this.#othentInstance().signDataItem(p);
  }

  public encrypt(
    data: BufferSource,
    options: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
  ): Promise<Uint8Array> {
    if (options) {
      console.warn(
        '[Arweave Wallet Kit] Othent does not support `encrypt()` options',
      );
    }

    return this.#othentInstance().encrypt(data);
  }

  public decrypt(
    data: BufferSource,
    options: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
  ): Promise<Uint8Array> {
    if (options) {
      console.warn(
        '[Arweave Wallet Kit] Othent does not support `decrypt()` options',
      );
    }

    return this.#othentInstance().decrypt(data);
  }

  public signature(
    data: Uint8Array,
    options: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
  ): Promise<Uint8Array> {
    if (options) {
      console.warn(
        '[Arweave Wallet Kit] Othent does not support `signature()` options',
      );
    }

    return this.#othentInstance().signature(data);
  }

  public getArweaveConfig(): Promise<GatewayConfig> {
    return this.#othentInstance().getArweaveConfig();
  }

  public async getPermissions() {
    const othent = this.#othentInstance();

    return othent.getSyncUserDetails()
      ? othent.getPermissions()
      : Promise.resolve([]);
  }

  // eslint-disable-next-line
  public async addToken(id: string): Promise<void> {
    throw new Error('Not implemented');
  }

  public addAddressEvent(listener: ListenerFunction) {
    this.#addressListeners.push(listener);

    // placeholder function
    return listener as any;
  }

  public removeAddressEvent(
    listener: (e: CustomEvent<{ address: string }>) => void,
  ) {
    this.#addressListeners.splice(
      this.#addressListeners.indexOf(listener as any),
      1,
    );
  }
  public async createDataItemSigner(): Promise<AoSigner> {
    throw new Error('Not available on Othent strategy');
  }
}
