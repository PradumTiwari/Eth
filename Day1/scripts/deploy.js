const hre=require("hardhat");

async function main(){
    const HelloWorld=await hre.ethers.getContractFactory("HelloWorld");
    const hello=await HelloWorld.deploy("Hello from Day 1");
    await hello.deployed();
    console.log("HelloWorld Deployed to ${hello.address}");
    
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});