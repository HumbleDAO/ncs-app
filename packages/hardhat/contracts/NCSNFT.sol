// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract NCSNFT is ERC721 {
    uint256 tokenId;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        tokenId = 0;
    }

    function mint(address _receiver) external returns (uint256) {
        uint256 newId = tokenId + 1;
        tokenId++;
        _mint(_receiver, newId);
        return newId;
    }
}
