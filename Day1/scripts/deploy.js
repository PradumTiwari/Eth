const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const MyMultiToken = await hre.ethers.getContractFactory("MyMultiToken");
  const multiToken = await MyMultiToken.deploy();

  console.log(`MyMultiToken deployed to: ${multiToken.target}`);

  await multiToken.mintToken(
    deployer.address,
    0,
    1000,
    "ipfs://QmTYG4v7DmNf9sCuLGEAfc9HdYoakrWcJDdQrRzUm9bawi"
  );

  await multiToken.mintToken(
    deployer.address,
    1,
    1000,
    "ipfs://QmYnM3QwkStCkZJ8TfHAF9SErjEtGRf69aDg8qqkFW9y3c"
  );

  await multiToken.mintToken(
    deployer.address,
    2,
    1,
    "ipfs://QmNWNGA4BQLehFxJfs1TVZdjE1f5vvsVbCFLWfLGHvksi5"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
