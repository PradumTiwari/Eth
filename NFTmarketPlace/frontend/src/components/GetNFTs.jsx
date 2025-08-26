import { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { useAccount } from "wagmi";
import Contract from "../contracts/contract-addresses.json"
const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_KEY,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

const GetNFTs = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = useState([]);

  const fetchUserNFTs = async () => {
    if (!address) return;

    try {
      // fetch all NFTs for owner filtered by your MockNFT contract
      const response1 = await alchemy.nft.getNftsForOwner(address);
console.log("All NFTs in my wallet:", response1);
      const response = await alchemy.nft.getNftsForOwner(address, {
       contractAddresses: [Contract.MockNFT],
      });
      console.log("Response is",response);
      

      setNfts(response.ownedNfts);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
    }
  };

  useEffect(() => {
    fetchUserNFTs();
    console.log("TOkens are",nfts);
    
  }, [address]);

  return (
    <div>
      <h2 className="text-xl font-bold">My NFTs from MockNFT</h2>
      {nfts.length === 0 ? (
        <p>No NFTs found in this collection.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {nfts.map((nft, i) => (
            <li key={i} className="p-2 border rounded">
              <p className="font-semibold">{nft.title || `Token #${nft.tokenId}`}</p>
              {nft.media[0]?.gateway && (
                <img
                  src={nft.media[0].gateway}
                  alt={nft.title}
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
