const {expect}=require('chai');

describe('Counter',function(){
    let Counter,counter;
    beforeEach(async function(){
        //Load the contract
        Counter=await ethers.getContractFactory("Counter");
        //Deploy with intial value 5
        counter=await Counter.deploy(5);
      
    });

    it("Should return the INtial Count",async function(){
        expect(await counter.getCount()).to.equal(5);

    });



    it("Should INcrement the Count",async function(){
        await counter.increment();
        expect(await counter.getCount()).to.equal(6);
    })

     it("Should Decrement the Count",async function(){
        await counter.decrement();
        expect(await counter.getCount()).to.equal(4);
    });

    it("Should not decrement below zero",async function(){
        //Deploy a fresh counter starting at 0
        counter=await Counter.deploy(0);
      
        await expect(counter.decrement()).to.be.revertedWith("Counter: cannot go below zero")
    })

})