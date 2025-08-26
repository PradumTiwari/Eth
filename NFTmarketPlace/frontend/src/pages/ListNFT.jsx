// src/pages/ListNFT.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useWriteContract, useChainId } from "wagmi";
import NFTArtifact from "../abi/MockNFT.json";
import MarketplaceArtifact from "../abi/NFTMarketplace.json";

const nftAbi = NFTArtifact.abi;
const marketplaceAbi = MarketplaceArtifact.abi;

const NFT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;

export default function ListNFT() {
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [tokenId, setTokenId] = useState(""); // we need a tokenId to list
  const [txHash, setTxHash] = useState(null);

  const chainId = useChainId();
  const { writeContract, isPending, error } = useWriteContract();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const getExplorerUrl = (hash) => {
    if (chainId === 11155111) return `https://sepolia.etherscan.io/tx/${hash}`;
    if (chainId === 1) return `https://etherscan.io/tx/${hash}`;
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Approve marketplace
      const approvalTx = await writeContract({
        address: NFT_ADDRESS,
        abi: nftAbi,
        functionName: "approve",
        args: [MARKETPLACE_ADDRESS, tokenId],
      });
      console.log("Approval Tx:", approvalTx);

      // 2️⃣ List NFT on marketplace
      const listTx = await writeContract({
        address: MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        functionName: "listItem",
        args: [NFT_ADDRESS, tokenId, price], // price is in wei, not ETH
      });

      console.log("List Tx:", listTx);
      setTxHash(listTx.hash);
    } catch (err) {
      console.error("Error listing NFT:", err);
    }
  };

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-gray-800"
      >
        List Your NFT
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow-lg rounded-2xl p-6 space-y-6"
      >
        {/* Upload */}
        <div>
          <label className="block font-medium mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full border border-gray-300 rounded-lg p-2"
          />
          {preview && (
            <motion.img
              src={preview}
              alt="Preview"
              className="mt-4 rounded-xl w-60 h-60 object-cover shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>

        {/* Token ID */}
        <div>
          <label className="block font-medium mb-2">Token ID</label>
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter Token ID"
            className="block w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium mb-2">NFT Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Cyber Punk Samurai"
            className="block w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe your NFT..."
            rows={4}
            className="block w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-2">Price (in WEI)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1000000000000000000 (1 ETH)"
            className="block w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                     text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          {isPending ? "Listing..." : "List NFT"}
        </motion.button>

        {error && <p className="text-red-500 mt-2">{error.message}</p>}
        {txHash && (
          <p className="text-green-600 mt-3">
            Listed!{" "}
            <a
              href={getExplorerUrl(txHash)}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              View Tx
            </a>
          </p>
        )}
      </motion.form>
    </div>
  );
}
