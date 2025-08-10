// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Counter Contract
/// @notice A simple contract to increment, decrement, and get a counter value
contract Counter {
    // STATE VARIABLE
    uint256 private count;

    /// @notice Constructor sets the initial value
    /// @param _initialCount The starting value of the counter
    constructor(uint256 _initialCount) {
        count = _initialCount;
    }

    /// @notice Get the current count
    /// @return The current counter value
    function getCount() public view returns (uint256) {
        return count;
    }

    /// @notice Increment the counter by 1
    function increment() public {
        count += 1;
    }

    /// @notice Decrement the counter by 1
    function decrement() public {
        require(count > 0, "Counter: cannot go below zero");
        count -= 1;
    }
}
