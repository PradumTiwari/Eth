import fetch from "node-fetch";
import fs from "fs";

const token = process.env.NFT_STORAGE_KEY;
const file = fs.readFileSync("./scripts/nft-image.webp");

const res = await fetch("https://api.nft.storage/upload", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "image/png"
  },
  body: file
});

console.log(await res.json());
