/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

interface NetworkConfig {
  publisherUrl: string;
  aggregatorUrl: string;
  explorerUrl: string;
}

const NETWORK_CONFIG: NetworkConfig = {
  publisherUrl: import.meta.env.VITE_WALRUS_MAINNET_PUBLISHER_URL || 'https://publisher.walrus.space',
  aggregatorUrl: import.meta.env.VITE_WALRUS_MAINNET_AGGREGATOR_URL || 'https://aggregator.walrus.space',
  explorerUrl: 'https://walruscan.com/mainnet'
};

interface NetworkContextType {
  config: NetworkConfig;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NetworkContext.Provider value={{ config: NETWORK_CONFIG }}>
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
