//SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

contract Whitelist{
    

    //Max number of whitelisted address allowed
    uint8 public maxWhitelistedAddress;

    mapping(address=>bool) public whitelistedAddress;

    uint8 public numberAddressesWhitelisted;

    constructor(uint8 _maxWhitelistedAddress){
        maxWhitelistedAddress=_maxWhitelistedAddress;
    }


    function addAddressToWhiteList() public{
        require(!whitelistedAddress[msg.sender],"Sender is already an whiteListed");
        require(numberAddressesWhitelisted<maxWhitelistedAddress,"More address cant be added,Limit reached");

        whitelistedAddress[msg.sender]=true;
        numberAddressesWhitelisted+=1;
    }


}