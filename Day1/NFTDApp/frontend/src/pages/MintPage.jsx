import React, { useState } from "react";
import { connectWallet, mintNFT } from "../utils/web3";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../utils/ipfs";

const MintPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");

  // Connect wallet
  async function handleConnectWallet() {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (err) {
      alert(err.message);
    }
  }

  // Handle file selection
  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  // Mint NFT
  async function handleMint() {
    if (!file || !name || !description) {
      alert("Please fill all fields and select a file.");
      return;
    }

    try {
      setStatus("Uploading image to IPFS...");
      const imageURI = await uploadFileToIPFS(file);

      setStatus("Uploading metadata to IPFS...");
      const metadata = { name, description, image: imageURI };
      const metadataURI = await uploadJSONToIPFS(metadata);

      setStatus("Minting NFT...");
      const tx = await mintNFT(metadataURI);

      setTxHash(tx.hash);
      setStatus("NFT minted successfully!");
      console.log("Transaction:", tx);
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6">NFT Minter dApp</h1>

      {!walletAddress ? (
        <button
          onClick={handleConnectWallet}
          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="mb-4">Connected: {walletAddress}</p>
      )}

      <input type="file" onChange={handleFileChange} className="mb-4 bg-gray-800 p-2 rounded" />
      <input
        type="text"
        placeholder="NFT Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 bg-gray-800 p-2 rounded w-64"
      />
      <textarea
        placeholder="NFT Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 bg-gray-800 p-2 rounded w-64"
      />

      <button
        onClick={handleMint}
        className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700"
      >
        Mint NFT
      </button>

      {status && <p className="mt-4">{status}</p>}

      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 text-blue-400 underline"
        >
          View on Explorer
        </a>
      )}
    </div>
  );
};

export default MintPage;
