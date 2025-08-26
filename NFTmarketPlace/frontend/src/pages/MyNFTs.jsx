import React, { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { useAccount } from "wagmi";
import Contract from "../contracts/contract-addresses.json";
import { useWriteContract } from "wagmi";
import mockNFTArtifact from "../abi/MockNFT.json";
import marketplaceArtifact from "../abi/NFTMarketplace.json";

const mockNFT=mockNFTArtifact.abi;
const marketPlaceabi=marketplaceArtifact.abi;

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_KEY,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

async function fetchUserMints(address) {
  try {
    const transfers = await alchemy.core.getAssetTransfers({
      toAddress: address,
      fromAddress: "0x0000000000000000000000000000000000000000",
      contractAddresses: [Contract.MockNFT],
      category: ["erc721"],
    });

    // fetch metadata for each minted token
    const mintedTokens = await Promise.all(
      transfers.transfers.map(async (tx) => {
        try {
          const nft = await alchemy.nft.getNftMetadata(
            Contract.MockNFT,
            tx.tokenId
          );
          return nft;
        } catch (err) {
          console.error("Error fetching metadata for", tx.tokenId, err);
          return null;
        }
      })
    );

    return mintedTokens.filter(Boolean);
  } catch (err) {
    console.error("Error fetching user mints:", err);
    return [];
  }
}

const MyNFTs = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = useState([]);
  const {writeContractAsync}=useWriteContract();
  
  const [loading, setLoading] = useState(false);

  const fetchUserNFTs = async () => {
    if (!address) return;
    setLoading(true);
    const minted = await fetchUserMints(address);
    setNfts(minted);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserNFTs();
  }, [address]);

    // 🔹 list NFT function (inside component)
  const listNFT = async (tokenId, price) => {
    try {
      // Step 1: approve marketplace
      await writeContractAsync({
        address: Contract.MockNFT,
        abi: mockNFT,
        functionName: "approve",
        args: [Contract.Marketplace, tokenId],
      });

      // Step 2: list NFT on marketplace
    const tx=  await writeContractAsync({
        address: Contract.Marketplace,
        abi: marketPlaceabi,
        functionName: "listItem",
        args: [Contract.MockNFT, tokenId, price],
      });

      console.log("Hash is ",tx);
      

      alert(`✅ NFT #${tokenId} listed for sale!`);
    } catch (err) {
      console.error("Error listing NFT:", err);
      alert("❌ Failed to list NFT. Check console for details.");
    }
  };


  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-8">
        🎨 My NFTs from MockNFT
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading NFTs...</p>
      ) : nfts.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">No NFTs found in this collection.</p>
          <button
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-md transition"
            onClick={fetchUserNFTs}
          >
            🔄 Refresh NFTs
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft, i) => (
            <li key={i} className="bg-white rounded-2xl shadow-xl p-4">
  {nft.image?.cachedUrl ? (
    <img
      src={nft.image.cachedUrl}
      alt={nft.title || `Token ${nft.tokenId}`}
      className="w-full h-56 object-cover rounded-xl mb-3"
    />
  ) : (
    <div className="w-full h-56 bg-gray-200 flex items-center justify-center rounded-xl mb-3">
      <span className="text-gray-500">No Image</span>
    </div>
  )}
  <p className="font-semibold text-lg text-center mb-2">
    {nft.name || `Token #${nft.tokenId}`}
  </p>

  <button
    className="w-full px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
    onClick={() => {
      const price = prompt("Enter price in ETH:");
      if (price) {
        const wei = BigInt(parseFloat(price) * 1e18);
        listNFT(nft.tokenId, wei);
      }
    }}
  >
    💰 List for Sale
  </button>
</li>

          ))}
        </ul>
      )}
    </div>
  );
};

export default MyNFTs;
