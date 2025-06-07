import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import {
  WagmiProvider,
  http
} from 'wagmi';
import {
  mainnet,
  sepolia,
  hardhat
} from 'wagmi/chains';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'Secure Vault',
  projectId: 'f99798e321897c5c286878a8180fc3a8',
  chains: [mainnet, sepolia, hardhat],
  ssr: false,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http()
  }
});

const queryClient = new QueryClient();

function AppWrapper() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={config.chains}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default AppWrapper;