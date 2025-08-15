//SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
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


        function listItem(address nftAddress,uint256 tokenId,uint256 price) external nonReentrant{
            require(price>0,"Price must be greater than zero");
            IERC721 nft=IERC721(nftAddress);

            //Check that msg.sender owns the nft
            require(nft.ownerOf(tokenId)==msg.sender,"You are not a Owner of this nft");

            //Check marketPlace approval
            require(nft.getApproved(tokenId)==address(this),"Market Place not approved");

            listings[nftAddress][tokenId]=Listing(price,msg.sender);

            emit ItemListed(nftAddress, tokenId, msg.sender, price);
        }

}