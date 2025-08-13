// src/components/WalletConnect.jsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

export default function WalletConnect({ setWalletAddress }) {
  const [connected, setConnected] = useState(false);

  async function connectWallet() {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setConnected(true);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <button 
      className="bg-blue-600 text-white px-4 py-2 rounded"
      onClick={connectWallet}
    >
      {connected ? 'Wallet Connected' : 'Connect Wallet'}
    </button>
  );
}
