// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IFakeNFTMarketplace{
    function getPrice() external view returns(uint256);

    function available(uint256 _tokenId) external view returns(bool);

    function purchase(uint256 _tokenId) external payable;
}

interface ICryptoDevsNFT {
 
    function balanceOf(address owner) external view returns (uint256);

   
    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256);
}

struct Proposal {
    // nftTokenId - the tokenID of the NFT to purchase from FakeNFTMarketplace if the proposal passes
    uint256 nftTokenId;
    // deadline - the UNIX timestamp until which this proposal is active. Proposal can be executed after the deadline has been exceeded.
    uint256 deadline;
    // yayVotes - number of yay votes for this proposal
    uint256 yayVotes;
    // nayVotes - number of nay votes for this proposal
    uint256 nayVotes;
    // executed - whether or not this proposal has been executed yet. Cannot be executed before the deadline has been exceeded.
    bool executed;
    // voters - a mapping of CryptoDevsNFT tokenIDs to booleans indicating whether that NFT has already been used to cast a vote or not
    mapping(uint256 => bool) voters;
}


contract CryptoDevsDAO is Ownable {
    // We will write contract code here
    // Create a mapping of ID to Proposal
mapping(uint256 => Proposal) public proposals;
// Number of proposals that have been created
uint256 public numProposals;
constructor(address _nftMarketplace, address _cryptoDevsNFT) Ownable(msg.sender) payable {
    nftMarketplace = IFakeNFTMarketplace(_nftMarketplace);
    cryptoDevsNFT = ICryptoDevsNFT(_cryptoDevsNFT);
}

modifier nftHolderOnly() {
    require(cryptoDevsNFT.balanceOf(msg.sender) > 0, "NOT_A_DAO_MEMBER");
    _;
}

function createProposal(uint256 _nftTokenId)
    external
    nftHolderOnly
    returns (uint256)
{
    require(nftMarketplace.available(_nftTokenId), "NFT_NOT_FOR_SALE");
    Proposal storage proposal = proposals[numProposals];
    proposal.nftTokenId = _nftTokenId;
    // Set the proposal's voting deadline to be (current time + 5 minutes)
    proposal.deadline = block.timestamp + 5 minutes;

    numProposals++;

    return numProposals - 1;
}
}