// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract BobERC721 is ERC721 {
  constructor() ERC721('Bob ERC 721', 'BobERC721') {}

  function mint(address to, uint256 tokenId) public {
    _mint(to, tokenId);
  }

  function burn(uint256 tokenId) public {
    _burn(tokenId);
  }
}
