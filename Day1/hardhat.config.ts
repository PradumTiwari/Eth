require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
const { PRIVATE_KEY, RPC_URL } = process.env;

module.exports = {
  solidity: "0.8.28",
  networks:{
    sepolia:{
      url:RPC_URL,
      accounts:[`0x${PRIVATE_KEY}`]
    }
  },
  typechain: {
    target: "ethers-v5",
  },
};
