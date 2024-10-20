import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useEffect, useMemo, useReducer } from 'react';
import { Helmet } from 'react-helmet';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import Context, { defaultState } from '../context';
import type { Config } from '../context/faces';
import globalReducer from '../context/reducer';
import { useSyncAddress } from '../hooks/active_address';
import { useSyncPermissions } from '../hooks/permissions';
import { ConnectModal } from '../modals/Connect';
import { ProfileModal } from '../modals/Profile';
import RestoreSession from '../modals/RestoreSession';
import StrategyPresets from '../strategy';
import Strategy from '../strategy/Strategy';
import { Font, ThemeProvider, darkTheme, lightTheme } from '../theme';
import { rgbToString } from '../utils/arweave';

('use client');

export function ArweaveWalletKit({
  children,
  theme = defaultTheme,
  config = defaultConfig,
  strategies = StrategyPresets,
}: PropsWithChildren<Props>) {
  const [state, dispatch] = useReducer(globalReducer, {
    ...defaultState,
    config,
    strategies: strategies,
  });

  // update config if it changes
  useEffect(() => {
    dispatch({
      type: 'UPDATE_CONFIG',
      payload: config,
    });
  }, [config]);

  // final theme config
  const themeConfig = useMemo<ThemeConfig>(
    () => ({
      ...defaultTheme,
      ...theme,
    }),
    [theme],
  );

  const wagmiConfig = createConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
  });

  return (
    <Context.Provider value={{ state, dispatch }}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={new QueryClient()}>
          <ThemeProvider
            theme={{
              ...(themeConfig.displayTheme === 'light'
                ? lightTheme
                : darkTheme),
              displayTheme: themeConfig.displayTheme || 'light',
              theme: rgbToString(themeConfig.accent),
              themeConfig,
            }}
          >
            <AddressSync>
              <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                  rel="preconnect"
                  href="https://fonts.gstatic.com"
                  crossOrigin=""
                />
                <link
                  href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
                  rel="stylesheet"
                />
              </Helmet>
              {children}
              <ConnectModal />
              <ProfileModal />
              <RestoreSession />
            </AddressSync>
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Context.Provider>
  );
}

const AddressSync = ({ children }: PropsWithChildren<{}>) => {
  useSyncPermissions();
  useSyncAddress();

  return <>{children}</>;
};

const defaultTheme: ThemeConfig = {
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
};

const defaultConfig: Config = {
  permissions: ['ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES'],
  ensurePermissions: false,
};

interface Props {
  theme?: Partial<ThemeConfig>;
  config?: Config;
  strategies?: Strategy[];
}

export interface ThemeConfig {
  displayTheme: 'dark' | 'light';
  accent: RGBObject;
  titleHighlight: RGBObject;
  radius: Radius;
  font: Font;
}

export interface RGBObject {
  r: number;
  g: number;
  b: number;
}

export type Radius = 'default' | 'minimal' | 'none';
