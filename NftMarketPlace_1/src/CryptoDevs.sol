// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Whitelist.sol";

contract CryptoDevs is ERC721Enumerable,Ownable{
    //price is the price of one Crypto dev nft
    uint256 constant public _price=0.01 ether;

    //Max number of CryptoDevs that can ever exist
    uint256 constant public maxTokenIds=20;

    Whitelist whitelist;

    //No of token reserved for whitelisted members
    uint256 public reserveTokens;
    uint256 public reservedTokensClaimed=0;

    constructor(address whitelistContract) ERC721("Crypto Devs","CD") Ownable(msg.sender){
        whitelist=Whitelist(whitelistContract);
        reserveTokens=whitelist.maxWhitelistedAddress();
    }


    function mint() public payable{
        //Make sure we always leave enough room for whitelist reservation
        require(totalSupply()+reserveTokens-reservedTokensClaimed<maxTokenIds,"EXCEEDED MAX SUpply");

        if(whitelist.whitelistedAddress(msg.sender)&&msg.value<_price){
            require(balanceOf(msg.sender)==0,"Already owned");
            reservedTokensClaimed+=1;
        }
        else{
            //if user is not the part of whitelist make sure it pays enough eth

            require(msg.value>=_price,"Not enough ether");
        }

        uint256 tokenId=totalSupply();
        _safeMint(msg.sender,tokenId);
    }


    function withdraw() public onlyOwner{
        address _owner=owner();
        uint256 amount=address(this).balance;
        (bool sent, )=_owner.call{value:amount}("");
        require(sent,"Failed to send ether");
    }
}