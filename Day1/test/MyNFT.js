const {expect}=require('chai');

describe("MyNFT",function(){
    let nft,owner,addr1;

    beforeEach(async function(){
        [owner,addr1]=await ethers.getSigners();
        const MyNFT=await ethers.getContractFactory("MyNFT");
        nft=await MyNFT.deploy();
    });

    it("Should mint an NFT and assign ownership",async function(){
        await nft.mintNFT(addr1.address,"ipfs://testhash");
        expect(await nft.ownerOf(0)).to.equal(addr1.address);
    });
    
        it("Should Store correct URI",async function(){
        await nft.mintNFT(addr1.address,"ipfs://testhash");
        expect(await nft.tokenURI(0)).to.equal("ipfs://testhash");
    });
    
});