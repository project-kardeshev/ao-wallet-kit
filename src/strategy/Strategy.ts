import { AoSigner } from '@project-kardeshev/ao-sdk/web';
import {
  AppInfo,
  DataItem,
  DispatchResult,
  GatewayConfig,
  PermissionType,
} from 'arconnect';
import { SignatureOptions } from 'arweave/node/lib/crypto/crypto-interface';
import Transaction from 'arweave/node/lib/transaction';

export abstract class Strategy {
  // info
  public abstract id: string;
  public abstract name: string;
  public abstract description: string;
  public abstract theme?: string;
  public abstract logo: string;
  public abstract url?: string;

  // restore session from previous connection
  // Arweave.app needs this
  public abstract resumeSession?(): Promise<void>;

  // connection
  public abstract connect(
    permissions: PermissionType[],
    appInfo?: AppInfo,
    gateway?: GatewayConfig,
  ): Promise<void>;
  public abstract disconnect(): Promise<void>;

  // other apis
  public abstract getActiveAddress(): Promise<string>;
  public abstract getAllAddresses?(): Promise<string[]>;
  public abstract sign(
    transaction: Transaction,
    options?: SignatureOptions,
  ): Promise<Transaction>;
  public abstract getPermissions(): Promise<PermissionType[]>;
  public abstract getWalletNames?(): Promise<{ [addr: string]: string }>;
  /**
   * @description Encrypts data using the active wallet's public key. Important: this method is not available in all strategies, and for arweave wallets the data should be converted to a b64url string after encryption
   * - and then back from a b64url string to a Uint8Array before decryption. Decoding to UTF-8 string will break the data, but b64url encoding/decoding will not.
   * @param data - data to encrypt, Uint8Array
   * @param algorithm - optional, defaults to RsaOaepParams
   *
   */
  public abstract encrypt?(
    data: BufferSource,
    algorithm?: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
  ): Promise<Uint8Array>;
  public abstract decrypt?(
    data: BufferSource,
    algorithm?: RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams,
  ): Promise<Uint8Array>;
  public abstract getArweaveConfig?(): Promise<GatewayConfig>;
  public abstract signature?(
    data: Uint8Array,
    algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
  ): Promise<Uint8Array>;
  public abstract getActivePublicKey?(): Promise<string>;
  public abstract addToken?(id: string): Promise<void>;
  public abstract dispatch(transaction: Transaction): Promise<DispatchResult>;

  /** Is this strategy available in the current context */
  public abstract isAvailable(): Promise<boolean | string> | boolean | string;

  /** Events */
  public abstract addAddressEvent?(
    listener: (address: string) => void,
  ): (e: CustomEvent<{ address: string }>) => void;
  public abstract removeAddressEvent?(
    listener: (e: CustomEvent<{ address: string }>) => void,
  ): void;
  public abstract signDataItem(p: DataItem): Promise<ArrayBuffer>;
  public abstract createDataItemSigner(): Promise<AoSigner>;
}
