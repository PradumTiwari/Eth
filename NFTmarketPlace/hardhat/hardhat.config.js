require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      
      url: process.env.ALCHEMY_URL, // or Infura
      accounts: [process.env.PRIVATE_KEY], // 🚨 NEVER commit this to GitHub
    },
  },
};

console.log("Alchemy URL:", process.env.ALCHEMY_URL);
console.log("Private Key:", process.env.PRIVATE_KEY ? "Loaded ✅" : "Missing ❌");
