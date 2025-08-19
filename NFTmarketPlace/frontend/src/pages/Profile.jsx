import { useAccount } from "wagmi";
import { useEffect, useState } from "react";


export default function Profile() {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const loadNFTs = async () => {

      if (!isConnected) return;

      try {
        const contract = nftContract();
        const balance = await contract.read.balanceOf([address]);
        const items = [];

        for (let i = 0; i < Number(balance); i++) {
          // since MockNFT doesn’t have tokenOfOwnerByIndex,
          // we’ll just display based on tokenIdCounter
          items.push({
            id: i,
            name: `MockNFT #${i}`,
            image: `https://picsum.photos/300?random=${i}`,
          });
        }
        setNfts(items);
      } catch (err) {
        console.error("Error loading NFTs", err);
      }
    };

    loadNFTs();
  }, [address, isConnected]);

  if (!isConnected) return <p>Please connect your wallet.</p>;

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <p className="mb-4 text-gray-600">Wallet: {address}</p>

      {nfts.length === 0 ? (
        <p>No NFTs owned yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <div key={nft.id} className="bg-white p-4 rounded-xl shadow">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-56 object-cover rounded-lg"
              />
              <h2 className="mt-2 font-semibold">{nft.name}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
