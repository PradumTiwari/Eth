//SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Whitelist.sol";

contract DeployWhitelist is Script{
    function run() external{
        vm.startBroadcast(0x824722d28f974ebf8f697bef5a8509a570e046675c14828b6295cd9651170dc0);
        new Whitelist(10);
        vm.stopBroadcast();
    }
}