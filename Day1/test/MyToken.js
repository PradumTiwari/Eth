const {expect}=require('chai');

describe("My Token",async function(){
    let token,deployer,address1;

    beforeEach(async function(){
        // console.log("Signers are",await ethers.getSigners());
        [deployer,address1]=await ethers.getSigners();

        const MyToken=await ethers.getContractFactory("MyToken");
        token=await MyToken.deploy(ethers.parseUnits("1000",18));
    });

    it("Should have correct name and symbol",async function(){
        expect(await token.name()).to.equal("MyToken");
        expect(await token.symbol()).to.equal("MTK");
    });

     it("Should Asign Total Supply to deployer",async function(){
        const total=await token.totalSupply();
       expect(await token.balanceOf(deployer.address)).to.equal(total);
    });

     it("Should transfer token",async function(){
       await token.transfer(address1.address,ethers.parseUnits("50",18));
        expect(await token.balanceOf(address1.address)).to.equal(ethers.parseUnits("50",18));

    });
})