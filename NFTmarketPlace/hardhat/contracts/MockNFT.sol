// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MockNFT is ERC721URIStorage {
    uint256 public tokenIdCounter;

    constructor() ERC721("MyNFT", "MNFT") {}

    function mint(address to, string memory tokenURI) external {
        _mint(to, tokenIdCounter);
        _setTokenURI(tokenIdCounter, tokenURI);
        tokenIdCounter++;
    }
}

