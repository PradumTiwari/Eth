import React, { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import MockNFT from "../abi/MockNFT.json"; // your ABI
import { Link } from "react-router-dom";
import Contract from "../contracts/contract-addresses.json";
import { useWaitForTransactionReceipt } from "wagmi";

const MintNFTForm = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();


  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [imageHash, setImageHash] = useState(null);
  const [metadataHash, setMetadataHash] = useState(null);

  const [txHash, setTxHash] = useState(null);

   const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
  });

 
  

    useEffect(() => {
    if (isConfirming) setStatus("⏳ Waiting for confirmation...");
    if (receipt) setStatus("✅ NFT minted and confirmed!");
  }, [isConfirming, receipt]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

 

 const handleMint = async () => {
  if (!file || !name || !description) {
    alert("Please provide all fields (name, description, image)");
    return;
  }
  if (!address) {
    alert("Connect your wallet first!");
    return;
  }

  try {
    setLoading(true);
    setStatus("Uploading image to IPFS...");

    // 1️⃣ Upload file to backend
    const formData = new FormData();
    formData.append("file", file);
    const fileRes = await fetch("http://localhost:5000/upload-file", {
      method: "POST",
      body: formData,
    });
    const { ipfsHash: uploadedImageHash } = await fileRes.json();
    setImageHash(uploadedImageHash);

    // 2️⃣ Build metadata JSON
    setStatus("Uploading metadata to IPFS...");
    const metadata = {
      name,
      description,
      image: `ipfs://${uploadedImageHash}`,
      attributes: [
        { trait_type: "Minted On", value: new Date().toISOString() },
      ],
    };

    // 3️⃣ Upload metadata
    const jsonRes = await fetch("http://localhost:5000/upload-json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata),
    });
    const { ipfsHash: uploadedMetadataHash } = await jsonRes.json();
    setMetadataHash(uploadedMetadataHash);

    // 4️⃣ Mint NFT
   setStatus("Minting NFT on blockchain...");
      const hash = await writeContractAsync({
        address: Contract.MockNFT,
        abi: MockNFT.abi,
        functionName: "mint",
        args: [address, `ipfs://${uploadedMetadataHash}`],
      });

     setTxHash(hash); // save hash to wait for receipt
      setStatus("⏳ Transaction sent, waiting for confirmation...");
  } catch (err) {
     console.error(err);
      setStatus("❌ Error: " + (err.message || "Transaction failed"));
  } finally {
     setLoading(false);
  }
};


  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-2">Mint a New NFT</h2>

      <input
        type="text"
        placeholder="NFT Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <textarea
        placeholder="NFT Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <input type="file" onChange={handleFileChange} className="mb-2" />

      <button
        onClick={handleMint}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Minting..." : "Mint NFT"}
      </button>

      {status && <p className="mt-2 text-sm">{status}</p>}
     {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline mt-2 block"
        >
          View on Etherscan
        </a>
      )}

 {receipt && (
        <div className="mt-4 border p-2 rounded">
          <h3 className="font-bold">Your Minted NFT 🎉</h3>
          <img
            src={`https://ipfs.io/ipfs/${imageHash}`}
            alt={name}
            className="w-48 h-48 object-cover rounded mt-2"
          />
          <p className="mt-1"><b>Name:</b> {name}</p>
          <p><b>Description:</b> {description}</p>
          <a
            href={`https://ipfs.io/ipfs/${metadataHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Metadata on IPFS
          </a>
        </div>
      )}
    </div>
  );
};

export default MintNFTForm;
