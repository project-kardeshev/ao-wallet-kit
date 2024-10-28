import { ComponentStory } from '@storybook/react';
import { useState } from 'react';

import { ConnectButton } from '../components/ConnectButton';
import { AOWalletKit } from '../components/Provider';
import { useActiveStrategy, useApi } from '../hooks';
import { WagmiStrategy } from '../strategy/strategies/Wagmi';
import { createWagmiDataItemSigner } from '../utils';

export default {
  name: 'ConnectButton',
  component: ConnectButton,
};

const Template: ComponentStory<typeof AOWalletKit> = (props) => {
  function Sign() {
    const api = useApi();
    const strategy = useActiveStrategy();
    const [txId, setTxId] = useState<string>('');

    async function sign() {
      console.log(strategy, api);
      if (strategy instanceof WagmiStrategy) {
        const signer = await createWagmiDataItemSigner(strategy.config);

        const partialData = {
          data: 'blah',
          tags: [{ name: 'test', value: 'test' }],
          target: ''.padEnd(43, '1'),
        };
        const { id } = await signer(partialData);
        console.log('Signed:', id);
        setTxId(id);
      }
    }
    return (
      <button
        onClick={sign}
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
        Sign Data {txId}
      </button>
    );
  }

  return (
    <div
      style={{
        height: '30vh',
      }}
    >
      <AOWalletKit {...props}>
        <ConnectButton accent={'rgb(0, 122, 255)'} />
        <Sign />
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
    permissions: ['ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES'],
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
