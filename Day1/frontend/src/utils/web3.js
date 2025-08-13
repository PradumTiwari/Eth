import { ethers } from "ethers";
import MyNFT from "../abis/MyNFT.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_MYNFT_ADDRESS;

if (!CONTRACT_ADDRESS) throw new Error("Missing VITE_MYNFT_ADDRESS in .env");

// 1️⃣ Connect wallet
export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not installed!");

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  console.log("Connected account:", accounts[0]);
  return accounts[0];
}

// 2️⃣ Get signer from MetaMask
export async function getSigner() {
  if (!window.ethereum) throw new Error("MetaMask not installed!");
  const provider = new ethers.BrowserProvider(window.ethereum); // v6 syntax
  return await provider.getSigner();
}

// 3️⃣ Get contract instance
export function getNFTContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, MyNFT.abi, signerOrProvider);
}

// 4️⃣ Mint NFT
export async function mintNFT(metadataURI) {
  const signer = await getSigner();
  const contract = getNFTContract(signer);

  const tx = await contract.mintNFT(await signer.getAddress(), metadataURI);
  return tx; // returns transaction object
}
