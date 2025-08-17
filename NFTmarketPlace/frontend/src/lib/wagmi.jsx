import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [mainnet, polygon, optimism, arbitrum, base],
});
