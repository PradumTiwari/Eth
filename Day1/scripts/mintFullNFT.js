require('dotenv').config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { ethers } = require("hardhat");
const args=require('minimist')(process.argv.slice(2));


async function uploadToPinata(filePath){
    const JWT=process.env.PINATA_JWT;
      if (!JWT) throw new Error("Missing PINATA_JWT in .env");
        const data = new FormData();
  data.append("file", fs.createReadStream(filePath));

  const metadata = JSON.stringify({ name: path.basename(filePath) });
  data.append("pinataMetadata", metadata);

  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
    maxBodyLength: "Infinity",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      Authorization: `Bearer ${JWT}`
    }
  });

  return res.data.IpfsHash;

}

async function uploadMetadata(name,description,imageCID){
   const JWT = process.env.PINATA_JWT; 
     const metadata = {
    name,
    description,
    image: `ipfs://${imageCID}`,
    attributes: []
  };
    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT}`
    }
  });

  return res.data.IpfsHash;
}

async function mintNFT(metadataCID) {
  const contractAddress = process.env.MYNFT_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.RPC_URL;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const MyNFT = await ethers.getContractFactory("MyNFT");
  const nft = MyNFT.attach(contractAddress).connect(wallet);

  console.log(`🚀 Minting NFT with metadata ipfs://${metadataCID}...`);
  const tx = await nft.mintNFT(wallet.address, `ipfs://${metadataCID}`);
  await tx.wait();

  console.log("✅ NFT Minted successfully!");
}

async function main() {
  const { name, desc, image } = args;
  if (!name || !desc || !image) {
    console.error("Usage: node scripts/mintFullNFT.js --name 'NFT Name' --desc 'Description' --image './path/to/image.png'");
    process.exit(1);
  }

  console.log("📤 Uploading image to Pinata...");
  const imageCID = await uploadToPinata(image);
  console.log("✅ Image uploaded:", imageCID);

  console.log("📤 Uploading metadata JSON to Pinata...");
  const metadataCID = await uploadMetadata(name, desc, imageCID);
  console.log("✅ Metadata uploaded:", metadataCID);

  await mintNFT(metadataCID);
}

main().catch(console.error);