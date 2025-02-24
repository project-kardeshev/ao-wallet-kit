import { ethereumWagmiConfig, weaveVmWagmiConfig } from '../../utils/ethereum';
import { WagmiStrategy } from './Wagmi';

export const ethereumStrategy = new WagmiStrategy({
  id: 'ethereum',
  name: 'Ethereum',
  description: 'Any Ethereum browser wallet connected via wagmi',
  theme: '0,0,0',
  logo: '4M9wYB5x1e-opn-cPEoLDt1pHP-tKMRpJ56uVGTUeog',
  wagmiConfig: ethereumWagmiConfig,
});

export const weaveVmStrategy = new WagmiStrategy({
  id: 'weaveVM',
  name: 'WeaveVM',
  description: 'Weave VM (metamask)',
  theme: '0,0,0',
  logo: '4M9wYB5x1e-opn-cPEoLDt1pHP-tKMRpJ56uVGTUeog',
  wagmiConfig: weaveVmWagmiConfig,
});
