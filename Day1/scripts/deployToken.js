const hre = require("hardhat");

async function main() {
  const MyToken = await hre.ethers.getContractFactory("MyToken");

  // Mint 1000 tokens (with 18 decimals)
  const token = await MyToken.deploy(hre.ethers.parseUnits("1000", 18));

  console.log(`MyToken deployed to: ${token.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
