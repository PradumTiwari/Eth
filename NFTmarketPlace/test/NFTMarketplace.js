const {expect}=require('chai');
const {ethers}=require('hardhat');

describe("NFTMarketplace",function(){
    let marketplace,mockNFT;
    let deployer,seller,buyer;

    beforeEach(async function(){
        [deployer,seller,buyer]=await ethers.getSigners();
        //Deploy marketplace

        const MarketPlace=await ethers.getContractFactory("NFTMarketplace");
        marketplace=await MarketPlace.deploy();
         await marketplace.waitForDeployment(); 

        const MockNft=await ethers.getContractFactory('MockNFT');
        mockNFT=await MockNft.deploy();
         await mockNFT.waitForDeployment(); 
       
        
        //Mint the Nft to the seller
        await mockNFT.connect(seller).mint(seller.address);
        
        //Approve marketPlace to transfer seller's NFT

        await mockNFT.connect(seller).approve(await marketplace.getAddress(),0);

    });    

    describe("listItem",function(){
        it("Should allow seller to list nft",async function(){
         await marketplace.connect(seller) .listItem(await mockNFT.getAddress(), 0, ethers.parseEther("1"));

        const listing = await marketplace.listings(await mockNFT.getAddress(), 0);
          expect(listing.price).to.equal(ethers.parseEther("1"));
            expect(listing.seller).to.equal(seller.address);
        });


        it("Should fail if the price is zero",async function(){
         await expect(
                marketplace.connect(seller).listItem(await mockNFT.getAddress(), 0, 0)
            ).to.be.revertedWith("Price must be greater than zero");  
        });

        it("Should Fail if not the owner",async function(){
            await expect(marketplace.connect(buyer).listItem(await mockNFT.getAddress(),0,ethers.parseEther("1"))).to.be.revertedWith("You are not a Owner of this nft");
        });


        it("Shoudl fail if marketplace not approved",async function(){
            await mockNFT.connect(seller).approve(ethers.ZeroAddress, 0);

            await expect(marketplace.connect(seller).listItem(await mockNFT.getAddress(),0,ethers.parseEther("1"))).to.be.revertedWith("Market Place not approved");

        })
    })




})
