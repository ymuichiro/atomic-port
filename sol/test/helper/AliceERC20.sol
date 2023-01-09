// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

/**
 * A basic token for testing the HashedTimelockERC20.
 */
contract AliceERC20 is ERC20 {
  constructor(uint256 _initialBalance) ERC20('Alice Token', 'AliceToken') {
    _mint(msg.sender, _initialBalance);
  }
}
