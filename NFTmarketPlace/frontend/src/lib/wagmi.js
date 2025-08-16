// wagmi.js (modern setup)
import { getDefaultConfig, WagmiProvider } from '@rainbow-me/rainbowkit';
import { createConfig } from 'wagmi';
import { http } from 'viem';
import { mainnet, sepolia, polygon } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

// Create unified config effortlessly:
export const wagmiConfig = getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: 'YOUR_PROJECT_ID', // WalletConnect v2 project ID
  chains: [mainnet, polygon, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
  },
});

// Wrap your app with WagmiProvider
export const Web3Provider = ({ children }) => (
  <WagmiProvider config={wagmiConfig}>
    {children}
  </WagmiProvider>
);
