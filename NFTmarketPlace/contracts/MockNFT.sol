//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract MockNFT is ERC721{
    uint256 public tokenIdCounter;

    constructor() ERC721("MyNFT","MNFT"){

    } 

    function mint(address to) external{
        _mint(to,tokenIdCounter);
        tokenIdCounter++;
    }

}