const hre=require('hardhat');

async function main(){
    const MyNFT=await hre.ethers.getContractFactory("MyNFT");
    const nft=await MyNFT.deploy();
console.log(`MyNft deployed to: ${nft.target}`);

    //MINT nft example
    await nft.mintNFT(
        "0x2391b67ffC395BF3Caff12Aa428AB8fE954422c2",
        "ipfs://QmExampleMetadataHash"
    );

    console.log("Minted NFT #0 to your address");
}

main().catch((error)=>{
    console.error(error);
    process.exitCode=1;
    
})