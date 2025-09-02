// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/CryptoDevs.sol";

contract DeployCryptoDevs is Script {
    function run() external {
        // Load private key from env
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address whitelistContract = vm.envAddress("WHITELIST_CONTRACT");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy CryptoDevs with Whitelist contract address
        CryptoDevs cryptoDevs = new CryptoDevs(whitelistContract);

        vm.stopBroadcast();
  console.log(" CryptoDevs deployed at:", address(cryptoDevs));
      
    }
}
