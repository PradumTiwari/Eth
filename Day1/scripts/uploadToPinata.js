require("dotenv").config();
const fs=require('fs');
const path=require('path');
const axios=require('axios');
const FormData=require('form-data');
async function uploadToIPFS(){
   const pinataJWT=process.env.PINATA_JWT;
   if(!pinataJWT){
    throw new Error("Missing PINATA_JWT in .env file");
    
   }
   //1.upload Image
   const imagePath=path.join(__dirname,"nft-image.webp");
   const imageData=new FormData();

   imageData.append("file",fs.createReadStream(imagePath));
   console.log("Uploading image to pinata ");
   
   const imageRes=await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      imageData,
       {
      maxBodyLength: Infinity,
      headers: {
        Authorization: `Bearer ${pinataJWT}`,
        ...imageData.getHeaders(),
      },
    }
   );

   const imageCID=imageRes.data.IpfsHash;
     console.log("✅ Image uploaded:", `ipfs://${imageCID}`);
 
    //Store NFT metadata
    const metadata = {
    name: "Epic NFT #1",
    description: "This is my first epic NFT with Pinata",
    image: `ipfs://${imageCID}`,
    attributes: [
      { trait_type: "Power", value: "9000" },
      { trait_type: "Rarity", value: "Legendary" },
    ],
  };

console.log("📤 Uploading metadata to Pinata...");
  const metaRes = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    metadata,
    {
      headers: {
        Authorization: `Bearer ${pinataJWT}`,
        "Content-Type": "application/json",
      },
    }
  );
   
   const metadataCID = metaRes.data.IpfsHash;
  console.log("✅ Metadata uploaded:", `ipfs://${metadataCID}`);

  console.log("\n🎯 Use this metadata URI in your smart contract mintNFT:");
  console.log(`ipfs://${metadataCID}`);

    
    
}

uploadToIPFS().catch(console.error);