// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyMultiToken is ERC1155, Ownable {
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant SWORD = 2;

    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC1155("") Ownable(msg.sender) {}

    function uri(uint256 id) public view override returns (string memory) {
        require(bytes(_tokenURIs[id]).length > 0, "URI not set");
        return _tokenURIs[id];
    }

    function mintToken(address to, uint256 id, uint256 amount, string memory newUri) public onlyOwner {
        _mint(to, id, amount, "");
        _tokenURIs[id] = newUri;
    }

    function mintBatchTokens(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        string[] memory uris
    ) public onlyOwner {
        require(ids.length == uris.length, "IDs and URIs length mismatch");
        _mintBatch(to, ids, amounts, "");
        for (uint256 i = 0; i < ids.length; i++) {
            _tokenURIs[ids[i]] = uris[i];
        }
    }
}
