import { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { useAccount } from "wagmi";
import Contract from "../contracts/contract-addresses.json";

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_KEY,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

// 🔥 fetch minted NFTs by checking transactions
async function fetchUserMints(address) {
  try {
    const transfers = await alchemy.core.getAssetTransfers({
      toAddress: address,                                // user received NFTs
      fromAddress: "0x0000000000000000000000000000000000000000", // mint source
      contractAddresses: [Contract.MockNFT],             // only our contract
      category: ["erc721"],
    });
    const test = await alchemy.nft.getNftsForOwner(address);
console.log("All NFTs this wallet owns:", test.ownedNfts);

    console.log("Raw mint transfers:", transfers.transfers);

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

    return mintedTokens.filter(Boolean); // remove nulls
  } catch (err) {
    console.error("Error fetching user mints:", err);
    return [];
  }
}

const GetNFTs = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = useState([]);

  const fetchUserNFTs = async () => {
    if (!address) return;
    const minted = await fetchUserMints(address);
    setNfts(minted);
  };

  useEffect(() => {
    fetchUserNFTs();
  }, [address]);

  return (
    <div>
      <h2 className="text-xl font-bold">My NFTs from MockNFT</h2>
      {nfts.length === 0 ? (
        <div>
          <p>No NFTs found in this collection.</p>
          <button
            className="p-2 bg-emerald-400 border rounded"
            onClick={fetchUserNFTs}
          >
            Refresh NFTs
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {nfts.map((nft, i) => (
            <li key={i} className="p-2 border rounded">
              <p className="font-semibold">
                {nft.name || `Token #${nft.tokenId}`}
              </p>
              {nft.image?.cachedUrl && (
                <img
                  src={nft.image.cachedUrl}
                  alt={nft.title || `Token ${nft.tokenId}`}
                  className="w-40 h-40 object-cover"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetNFTs;
