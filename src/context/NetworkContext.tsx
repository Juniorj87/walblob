/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

export type NetworkType = 'testnet' | 'mainnet';

interface NetworkConfig {
  publisherUrl: string;
  aggregatorUrl: string;
  explorerUrl: string;
}

const NETWORKS: Record<NetworkType, NetworkConfig> = {
  testnet: {
    publisherUrl: import.meta.env.VITE_WALRUS_PUBLISHER_URL || 'https://publisher.walrus-testnet.walrus.space',
    aggregatorUrl: import.meta.env.VITE_WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space',
    explorerUrl: 'https://walruscan.com/testnet'
  },
  mainnet: {
    publisherUrl: import.meta.env.VITE_WALRUS_MAINNET_PUBLISHER_URL || 'https://publisher.walrus.space',
    aggregatorUrl: import.meta.env.VITE_WALRUS_MAINNET_AGGREGATOR_URL || 'https://aggregator.walrus.space',
    explorerUrl: 'https://walruscan.com/mainnet'
  }
};

interface NetworkContextType {
  network: NetworkType;
  config: NetworkConfig;
  setNetwork: (network: NetworkType) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetworkState] = useState<NetworkType>(() => {
    const saved = localStorage.getItem('walblob_network');
    return (saved === 'mainnet' ? 'mainnet' : 'testnet') as NetworkType;
  });

  const setNetwork = (n: NetworkType) => {
    setNetworkState(n);
    localStorage.setItem('walblob_network', n);
  };

  const config = NETWORKS[network];

  return (
    <NetworkContext.Provider value={{ network, config, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
