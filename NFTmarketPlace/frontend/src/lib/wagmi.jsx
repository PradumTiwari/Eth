import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet,sepolia, optimism, polygon } from 'wagmi/chains';

// Define the local Hardhat chain (JS version)
export const hardhatChain = {
  id: 31337,
  name: 'Hardhat Localhost',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    default: { name: 'Hardhat', url: '' },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: import.meta.env.VITE_PROJECT_ID,
 chains: [sepolia,hardhatChain, mainnet, polygon, optimism, arbitrum, base]
});
