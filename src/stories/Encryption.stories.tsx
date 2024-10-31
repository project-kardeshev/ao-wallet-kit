import { ComponentStory } from '@storybook/react';
import { useState } from 'react';

import { ConnectButton } from '../components/ConnectButton';
import { AOWalletKit } from '../components/Provider';
import { useActiveStrategy } from '../hooks';
import { fromB64Url, toB64Url } from '../utils';

function Encrypt() {
  const strategy = useActiveStrategy();
  const message = 'Encrypt me!';
  const [encrypted, setEncrypted] = useState<string | null>(null);
  const [decrypted, setDecrypted] = useState<string | null>(null);

  async function encrypt() {
    if (strategy?.encrypt && strategy?.decrypt) {
      const encryptedMessage = await strategy.encrypt(
        new TextEncoder().encode(message),
      );

      setEncrypted(toB64Url(Buffer.from(encryptedMessage)));
    }
  }

  async function decrypt() {
    if (strategy?.decrypt && encrypted) {
      const decryptedMessage = await strategy.decrypt(fromB64Url(encrypted));
      setDecrypted(new TextDecoder().decode(decryptedMessage));
    }
  }
  return (
    <>
      <button
        onClick={encrypt}
        style={{
          backgroundColor: 'rgb(0, 122, 255)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          marginTop: '1rem',
        }}
      >
        Encrypt
      </button>

      <button
        onClick={decrypt}
        style={{
          backgroundColor: 'rgb(0, 122, 255)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          marginTop: '1rem',
        }}
      >
        Decrypt
      </button>
      <p>
        Encrypted: <strong>{encrypted ?? ''}</strong>
      </p>
      <p>
        Decrypted: <strong>{decrypted ?? ''}</strong>
      </p>
    </>
  );
}

export default {
  name: 'Encryption',
  component: Encrypt,
};

const Template: ComponentStory<typeof AOWalletKit> = (props) => {
  return (
    <div
      style={{
        height: '30vh',
      }}
    >
      <AOWalletKit {...props}>
        <ConnectButton accent={'rgb(0, 122, 255)'} />
        <Encrypt />
      </AOWalletKit>
    </div>
  );
};

export const Basic = Template.bind({});

Basic.args = {
  theme: {
    displayTheme: 'light',
    accent: {
      r: 0,
      g: 0,
      b: 0,
    },
    titleHighlight: {
      r: 0,
      g: 122,
      b: 255,
    },
    radius: 'default',
    font: {
      fontFamily: 'Manrope',
    },
  },
  config: {
    permissions: [
      'ACCESS_ADDRESS',
      'ACCESS_ALL_ADDRESSES',
      'ENCRYPT',
      'DECRYPT',
    ],
    ensurePermissions: true,
    appInfo: {
      name: 'Test App',
      logo: 'https://arweave.net/tQUcL4wlNj_NED2VjUGUhfCTJ6pDN9P0e3CbnHo3vUE',
    },
    gatewayConfig: {
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    },
  },
};
