const hre=require('hardhat');

async function main(){
    const MyNFT=await hre.ethers.getContractFactory("MyNFT");
    const nft=await MyNFT.deploy();
    console.log(`MyNft deployed to: ${nft.target}`);

    const metadataURI="ipfs://Qmb81u8SrPRfZYYo747zLrrvC8UCSmgnF8BigfAvk7JM4v";

    //MINT nft example
    await nft.mintNFT(
        "0x2391b67ffC395BF3Caff12Aa428AB8fE954422c2",
        metadataURI
    );

    console.log("Minted NFT with metadata to your address",metadataURI);
}

main().catch((error)=>{
    console.error(error);
    process.exitCode=1;
    
})