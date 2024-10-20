import { connect, disconnect, getAccount } from '@wagmi/core';
import { DataItem, DispatchResult, PermissionType } from 'arconnect';
import { SignatureOptions } from 'arweave/node/lib/crypto/crypto-interface';
import Transaction from 'arweave/node/lib/transaction';
import { ethers } from 'ethers';
import { Config as WagmiConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';

import {
  createWagmiDataItemSigner,
  getEthersSigner,
} from '../../utils/ethereum';
import Strategy from '../Strategy';

export type WagmiStrategyOptions = {
  id: string;
  name: string;
  description: string;
  theme: string;
  logo: string;
  wagmiConfig: WagmiConfig;
};

export default class WagmiStrategy implements Strategy {
  public id: string;
  public name: string;
  public description: string;
  public theme: string; // Customize as needed
  public logo: string; // arweave tx id of the logo
  private config: WagmiConfig;
  public signer: ethers.Signer | null = null;
  public account: string | null = null;
  private unsubscribeAccount: null | (() => void) = null;

  constructor({
    id,
    name,
    description,
    theme,
    logo,
    wagmiConfig,
  }: WagmiStrategyOptions) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.theme = theme;
    this.logo = logo;
    this.config = wagmiConfig;

    // Set up listeners for signer and account changes
    this.setupListeners();
  }

  private setupListeners() {
    // Subscribe to account changes
    this.unsubscribeAccount = this.config.subscribe(
      (state) => state.current,
      (current) => {
        this.account = current ?? null;
        console.log('Account changed:', this.account);

        // Update signer when account changes
        if (this.account) {
          getEthersSigner(this.config).then((signer) => {
            this.signer = signer;
            console.log('Signer updated:', this.signer);
          });
        } else {
          this.signer = null;
        }
      },
    );
  }

  public cleanupListeners() {
    if (this.unsubscribeAccount) {
      this.unsubscribeAccount();
    }
  }

  public async isAvailable(): Promise<boolean> {
    const { ethereum } = window;
    if (!ethereum) {
      console.error(
        `[Ethereum Wallet Kit] "${this.id}" strategy is unavailable. window.ethereum is undefined.`,
      );
      return false;
    } else return true;
  }

  public async sync(): Promise<void> {
    // Optional sync method depending on your strategy's needs
  }

  public async connect(): Promise<void> {
    try {
      // Use injected connector for MetaMask or other injected wallets
      const account = await connect(this.config, {
        connector: injected({ target: 'metaMask' }),
      });
      this.account = account.accounts[0];
      this.signer = await getEthersSigner(this.config);
      console.log('Connected to account:', account);
    } catch (error) {
      console.error(`[AO Wallet Kit] Error connecting to wallet:`, error);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await disconnect(this.config);
      this.account = null;
      this.signer = null;
      console.log('Disconnected from wallet.');
    } catch (error) {
      console.error(`[Ethereum Wallet Kit] Error disconnecting:`, error);
    }
  }

  public async getActiveAddress(): Promise<string> {
    return this.account ?? '';
  }

  public async getAllAddresses(): Promise<string[]> {
    const accounts = getAccount(this.config).addresses;
    return (accounts ?? []) as string[];
  }

  public async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer not available');
    }
    return await this.signer.signMessage(message);
  }

  public async signTransaction(
    transaction: ethers.TransactionRequest,
  ): Promise<string> {
    if (!this.signer) {
      throw new Error('Signer not available');
    }
    const txResponse = await this.signer.sendTransaction(transaction);
    return txResponse.hash;
  }

  public async signDataItem(dataItem: DataItem): Promise<ArrayBuffer> {
    if (!this.signer) {
      throw new Error('Signer not available');
    }
    const signDataItem = await createWagmiDataItemSigner(this.config);
    return signDataItem(dataItem).then((res) => res.raw);
  }
  public addAddressEvent(listener: (address: string) => void) {
    // Subscribe to account changes
    const unsubscribe = this.config.subscribe(
      (state) => state.current,
      (account) => {
        if (account) {
          listener(account);
        }
      },
    );

    // Return the unsubscribe function to allow cleaning up the event listener if needed
    return (e: CustomEvent<{ address: string }>) => unsubscribe();
  }

  public removeAddressEvent(
    listener: (e: CustomEvent<{ address: string }>) => void,
  ) {
    listener(new CustomEvent(this.account ?? ''));
  }

  public async encrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
  ): Promise<Uint8Array> {
    throw new Error(
      'Method not yet available on ethereum wallets. (coming soon)',
    );
  }
  public async decrypt(
    data: BufferSource,
    algorithm: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
  ): Promise<Uint8Array> {
    throw new Error(
      'Method not yet available on ethereum wallets. (coming soon)',
    );
  }
  public async getPermissions(): Promise<PermissionType[]> {
    return [] as PermissionType[];
  }
  public async dispatch(transaction: Transaction): Promise<DispatchResult> {
    throw new Error('Method not available on ethereum wallets.');
  }
  public async addToken(address: string): Promise<void> {
    throw new Error('Method not available on ethereum wallets');
  }
  public async sign(
    transaction: Transaction,
    options?: SignatureOptions,
  ): Promise<Transaction> {
    throw new Error(
      'Method not available on ethereum wallets - use signDataItem instead',
    );
  }
  public async getWalletNames(): Promise<{ [addr: string]: string }> {
    throw new Error('Method not available on ethereum wallets.');
  }
}
