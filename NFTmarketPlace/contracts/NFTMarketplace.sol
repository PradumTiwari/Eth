//SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NFTMarketplace is ReentrancyGuard, Ownable{

        struct Listing{
            uint256 price;
            address seller;
        }

        //NFT contract address =>Token Id=>Listing
        mapping(address=>mapping(uint256=>Listing)) public listings;

        //Events for ui updates
        event ItemListed(address indexed nftAddress, uint256 indexed tokenId,address seller,uint256 price);

        event ItemSold(address indexed nftAddress,uint256 indexed tokenId,address buyer,uint256 price);

        event ItemCancelled(address indexed nftAddress,uint256 indexed tokenId,address seller);

        constructor(){}


}