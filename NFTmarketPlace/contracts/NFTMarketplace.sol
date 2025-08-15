//SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NFTMarketplace is ReentrancyGuard, Ownable{

    mapping(address=>uint256) public proceeds;

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
        
        event ProceedsWithdrawn(address indexed seller, uint256 amount);

        event ItemUpdated(address indexed nftAddress,uint256 indexed tokenId,uint256 newPrice);


        constructor() Ownable(msg.sender){}


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

        function buyItem(address nftAddress,uint256 tokenId) external payable nonReentrant{
            Listing memory listedItem=listings[nftAddress][tokenId];
            require(listedItem.price>0,"Item not Listed For sale");
            require(msg.value>=listedItem.price,"Not Enough ETH sent");

            //Remove the listing before the transfering
            delete listings[nftAddress][tokenId];
         //Store seller's procceds
           proceeds[listedItem.seller]+=listedItem.price;



            //Transfer the nft from the seller to the buyer
            IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);

            emit ItemSold(nftAddress,tokenId,msg.sender,listedItem.price);
        }



        function cancelListing(address nftAddress,uint256 tokenId) external nonReentrant{
            Listing memory listedItem=listings[nftAddress][tokenId];
            require(listedItem.price>0,"Item Not Listed");
            require(listedItem.seller==msg.sender,"You are not the seller");
            delete listings[nftAddress][tokenId];

            emit ItemCancelled(nftAddress, tokenId, msg.sender);

        }


        function withdrawProceeds() external nonReentrant{
            uint256 amount=proceeds[msg.sender];
             require(amount > 0, "No proceeds to withdraw");

        proceeds[msg.sender] = 0; // Effects before interaction (prevent reentrancy)

           (bool success, ) = payable(msg.sender).call{value: amount}("");

           require(success,"Transfer failed");
              emit ProceedsWithdrawn(msg.sender, amount);
        }


        function updateListing(address nftAddress,uint256 tokenId,uint256 newPrice) external nonReentrant{
            Listing storage listedItem=listings[nftAddress][tokenId];

            require(listedItem.price>0,"Item not listed");
            require(listedItem.seller==msg.sender,"You are not the Seller");
            require(newPrice>0,"Price must be greater than 0");

            listedItem.price=newPrice;

            emit ItemUpdated(nftAddress,tokenId,newPrice);

        }



        //Get details of a specific listing
        function getListing(address nftAddress,uint256 tokenId) external view returns (Listing memory){
            return listings[nftAddress][tokenId];

        }

         /// @notice Get the amount of proceeds available for a seller
    function getProceeds(address seller) external view returns (uint256) {
        return proceeds[seller];
    }



}