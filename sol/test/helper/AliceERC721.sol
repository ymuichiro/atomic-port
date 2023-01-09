// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract AliceERC721 is ERC721 {
  constructor(uint256 _initialBalance) ERC721('Alice ERC721 Token', 'AliceERC721') {}

  function mint(address to, uint256 tokenId) public {
    _mint(to, tokenId);
  }

  function burn(uint256 tokenId) public {
    _burn(tokenId);
  }
}
