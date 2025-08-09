const {expect}=require('chai')
const {ethers}=require('hardhat');

describe('Voting contract',function(){
    let Voting;
    let voting;
    let owner;
   beforeEach(async function () {
  [owner] = await ethers.getSigners(); // get signers first
  Voting = await ethers.getContractFactory("Voting");
  voting = await Voting.deploy();
 
});

    it("Should Add candidates",async function(){
        await voting.addCandidate("Alice");
         await voting.addCandidate("Bob");

         expect(await voting.candidatesCount()).to.equal(2);
        expect((await voting.candidates(0)).name).to.equal("Alice");
        expect((await voting.candidates(1)).name).to.equal("Bob");
    });

    it("Should Allow voting and update vote count",async function(){
        await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");

    await voting.vote(0);
     expect(await voting.getVote(0)).to.equal(1);

    await voting.vote(1);
    expect(await voting.getVote(1)).to.equal(1);
    });

    it("Should Emit event on vote",async function(){
        await voting.addCandidate("Alice");
        await expect(voting.vote(0)).to.emit(voting,"Voted").withArgs(0);
    });

    it("Should revert when voting invalid candidate", async function () {
    await voting.addCandidate("Alice");
    await expect(voting.vote(5)).to.be.revertedWith("Invalid Candidate");
  });
})