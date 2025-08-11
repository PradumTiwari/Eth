const {expect}=require('chai');

describe("MyMultiToken",async function(){
     let token, owner, addr1;

 beforeEach(async function(){
        [owner,addr1]=await ethers.getSigners();
        const MultiToken=await ethers.getContractFactory("MyMultiToken");
        token=await MultiToken.deploy();

     })

     it("Should Mint Fungible Gold",async function(){
        await token.mintToken(addr1.address,0,1000,"ipfs://QmTYG4v7DmNf9sCuLGEAfc9HdYoakrWcJDdQrRzUm9bawi");
        expect(await token.balanceOf(addr1.address,0)).to.equal(1000);
        expect(await token.uri(0)).to.equal("ipfs://QmTYG4v7DmNf9sCuLGEAfc9HdYoakrWcJDdQrRzUm9bawi");

     });
      it("Should mint a Silver ", async function () {
    await token.mintToken(addr1.address, 1, 10, "ipfs://QmYnM3QwkStCkZJ8TfHAF9SErjEtGRf69aDg8qqkFW9y3c");
    expect(await token.balanceOf(addr1.address, 1)).to.equal(10);
    expect(await token.uri(1)).to.equal("ipfs://QmYnM3QwkStCkZJ8TfHAF9SErjEtGRf69aDg8qqkFW9y3c");
  });

    it("Should mint a SWORD NFT", async function () {
    await token.mintToken(addr1.address, 2, 1, "ipfs://QmNWNGA4BQLehFxJfs1TVZdjE1f5vvsVbCFLWfLGHvksi5");
    expect(await token.balanceOf(addr1.address, 2)).to.equal(1);
    expect(await token.uri(2)).to.equal("ipfs://QmNWNGA4BQLehFxJfs1TVZdjE1f5vvsVbCFLWfLGHvksi5");
  });
  
  it("Should batch mint multiple token types", async function () {
   await token.mintBatchTokens(
    addr1.address,
    [0,1],
    [1000,200],
    ["ipfs://QmTYG4v7DmNf9sCuLGEAfc9HdYoakrWcJDdQrRzUm9bawi","ipfs://QmYnM3QwkStCkZJ8TfHAF9SErjEtGRf69aDg8qqkFW9y3c"]
   );
      expect(await token.balanceOf(addr1.address, 0)).to.equal(1000);
    expect(await token.balanceOf(addr1.address, 1)).to.equal(200);
  });
})