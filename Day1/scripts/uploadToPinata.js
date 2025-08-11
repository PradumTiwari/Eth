// scripts/upload-erc1155-to-pinata.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const PINATA_JWT = process.env.PINATA_JWT;
if (!PINATA_JWT) throw new Error("Add PINATA_JWT to .env");

async function uploadFile(filePath) {

  const form = new FormData();// creates form data for pinata
  form.append("file", fs.createReadStream(filePath));
  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", form, {
    maxBodyLength: Infinity,
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      ...form.getHeaders(),
    },
  });
  return res.data.IpfsHash; // CID
}

async function uploadJSON(json) {
  const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", json, {
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      "Content-Type": "application/json",
    },
  });
  return res.data.IpfsHash;
}

async function main() {
  const assetsDir = path.join(__dirname, "..", "assets");
  const files = fs.readdirSync(assetsDir).filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f));
  const result = {}; // tokenId -> { imageCID, metadataCID, metadataURI }

  for (const file of files) {
    // we assume filename is the token id, like "100.png"
    const tokenId = path.parse(file).name;
    console.log("Uploading image for token", tokenId);

    const imagePath = path.join(assetsDir, file);
    const imageCID = await uploadFile(imagePath);
    const imageURI = `ipfs://${imageCID}`;

    const metadata = {
      name: `MyItem #${tokenId}`,
      description: `Description for token ${tokenId}`,
      image: imageURI,
      attributes: [
        { trait_type: "Example", value: "Demo" }
      ]
    };

    console.log("Uploading metadata JSON for token", tokenId);
    const metadataCID = await uploadJSON(metadata);
    const metadataURI = `ipfs://${metadataCID}`;

    result[tokenId] = { imageCID, metadataCID, metadataURI };
    console.log(`-> token ${tokenId} metadata: ${metadataURI}\n`);
  }

  // Save a local map for later use by the deploy script
  fs.writeFileSync(path.join(__dirname, "..", "tokens-metadata.json"), JSON.stringify(result, null, 2));
  console.log("Saved tokens-metadata.json");
}

main().catch(err => { console.error(err.response?.data || err.message || err); process.exit(1); });
