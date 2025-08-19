import React from "react";
import { useWriteContract } from "wagmi";
import ContractArtifact from "../abi/MockNFT.json";

const abi = ContractArtifact.abi;
const CONTRACT_ADDRESS = "0x0Ea9c6c0C07A7790940E996d3a594951F86c5605";

const MintButton = () => {
  const { writeContract, data, isPending, error } = useWriteContract();

  const handleMint = async () => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "mint",
        args: ["0x2391b67ffC395BF3Caff12Aa428AB8fE954422c2"], // your wallet address
      });
      console.log("Transaction sent:", data);
    } catch (err) {
      console.error("Mint failed", err);
    }
  };

  return (
    <div>
      <button
        onClick={handleMint}
        disabled={isPending}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
      >
        {isPending ? "Minting..." : "Mint NFT"}
      </button>

      {error && <p className="text-red-500 mt-2">{error.message}</p>}
      {data && (
        <p className="text-green-500 mt-2">
          Tx sent:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${data.hash}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            View on Etherscan
          </a>
        </p>
      )}
    </div>
  );
};

export default MintButton;
