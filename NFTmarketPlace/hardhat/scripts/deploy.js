const hre=require('hardhat');
const {writeFileSync}=require("fs");
const path=require("path");
async function main(){
    const [deployer]=await hre.ethers.getSigners();
      console.log("Deploying with account:", deployer.address);

      //Deploy MockNFT
      const MockNFT=await hre.ethers.getContractFactory('MockNFT');
      const mockNFT=await MockNFT.deploy();

  
      console.log("MockNFT deployed at:", await mockNFT.getAddress());
    
      //Deploy marketPlace
      const Marketplace=await hre.ethers.getContractFactory("NFTMarketplace");

      const marketplace=await Marketplace.deploy();

      console.log("MarketPlace deployed at",await marketplace.getAddress());


      //Save to json
      const address={
        MockNFT:await mockNFT.getAddress(),
        Marketplace:await marketplace.getAddress()
      };

      const filePath=path.join(__dirname,"../../frontend/src/contracts/contract-addresses.json");

      writeFileSync(filePath,JSON.stringify(address,null,2));
       console.log("✅ Contract addresses written to:", filePath);
    
    
      


    }


    main().catch((error)=>{
        console.error(error);
        process.exitCode=1;
        
    })