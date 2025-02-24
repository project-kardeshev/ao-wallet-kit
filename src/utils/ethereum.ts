import { InjectedEthereumSigner, createData } from '@dha-team/arbundles';
import { arrayify } from '@ethersproject/bytes';
import {
  Config as WagmiConfig,
  createConfig,
  getConnectorClient,
  http,
} from '@wagmi/core';
import {
  BrowserProvider,
  JsonRpcApiProvider,
  JsonRpcSigner,
  hashMessage,
} from 'ethers';
import { Account, Chain, Client, Transport, recoverPublicKey } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';

import { weaveVmChainConfig } from './chains';
import { toB64UrlOfSHA256 } from './encoding';

// Initialize wagmi config
export const ethereumWagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export const weaveVmWagmiConfig = createConfig({
  chains: [weaveVmChainConfig],
  transports: {
    [weaveVmChainConfig.id]: http(),
  },
});

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = chain
    ? {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      }
    : undefined;
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner(
  config: WagmiConfig,
  { chainId }: { chainId?: number } = {},
) {
  const client = await getConnectorClient(config, { chainId });
  return clientToSigner(client);
}

export async function getEthersPublicKeyFromClient(
  config: WagmiConfig,
  { chainId }: { chainId?: number } = {},
) {
  const client = await getEthersSigner(config, { chainId });
  const message = 'message to sign to get public encryption key';
  const signedMessage = await client.signMessage(message);
  // Recover the public key using the viem's recoverPublicKey method
  const recoveredKey = await recoverPublicKey({
    hash: arrayify(hashMessage(message)), // Hash the message then arrayify it
    signature: signedMessage as `0x${string}`,
  });

  return recoveredKey;
}

export function normalizeHexPublicKey(publicKey: string) {
  return toB64UrlOfSHA256(Buffer.from(publicKey.slice(2), 'hex'));
}

export async function getNormalizedArweaveAddressFromClient(
  config: WagmiConfig,
  { chainId }: { chainId?: number } = {},
): Promise<string> {
  return normalizeHexPublicKey(
    await getEthersPublicKeyFromClient(config, { chainId }),
  );
}
export function createBrowserEthereumDataItemSigner(
  ethersProvider: BrowserProvider | JsonRpcApiProvider,
) {
  const signer = async ({ data, tags, target }: any) => {
    const ethersSigner = await ethersProvider.getSigner();
    const provider = {
      getSigner: () => ({
        signMessage: (message: any) => ethersSigner.signMessage(message),
      }),
    };
    const ethSigner = new InjectedEthereumSigner(provider);
    await ethSigner.setPublicKey();
    const dataItem = createData(data, ethSigner, {
      tags,
      target,
      anchor: Math.round(Date.now() / 1000)
        .toString()
        .padStart(32, Math.floor(Math.random() * 10).toString()),
    });

    const res = await dataItem.sign(ethSigner).then(async () => ({
      id: dataItem.id,
      raw: dataItem.getRaw(),
    }));

    return res;
  };

  return signer;
}

export async function createWagmiDataItemSigner(
  config: WagmiConfig,
  { chainId }: { chainId?: number } = {},
) {
  const signer = await getEthersSigner(config, { chainId });
  return createBrowserEthereumDataItemSigner(signer.provider);
}
