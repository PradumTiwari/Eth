require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();//Returns all availabe account in your network
  console.log("Ethers.signers",await ethers.getSigners());
  
  console.log(`🚀 Deploying contract with account: ${deployer.address}`);

  // Deploy contract
  const MyNFT = await ethers.getContractFactory('MyNFT');
  const myNftInstance = await MyNFT.deploy();
  await myNftInstance.waitForDeployment();

  console.log(`✅ Contract deployed at: ${myNftInstance.target}`);

  const myNftaddress = myNftInstance.target;
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.RPC_URL;

  if (!myNftaddress || !privateKey || !rpcUrl) {
    throw new Error('❌ Missing environment variables in .env');
  }

  // Mint NFT after deployment
  //1st deploy your contract and then mint NFt by connect wallet to the rpc provider
  //2nd 
  const metadataURI = "ipfs://QmTYG4v7DmNf9sCuLGEAfc9HdYoakrWcJDdQrRzUm9bawi";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const nft = MyNFT.attach(myNftaddress).connect(wallet);

  console.log(`🚀 Minting NFT to ${wallet.address} ...`);
  const tx = await nft.mintNFT(wallet.address, metadataURI);
  console.log("⏳ Transaction sent:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ NFT Minted!");
  console.log("📄 Transaction receipt:", receipt);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
