// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Ticket is ERC721, Ownable {
    using Counters for Counters.Counter;

    //ticket _price.
    uint256 private immutable _price;

    Counters.Counter private _tokenIdCounter;

    constructor(uint256 price,string memory name,string memory symbol) ERC721(name,symbol) {
        _price = price;
    }

    function publicMint() payable public {
        require(msg.value>=_price,"price error");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }

    //onlyOwner
    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    //withDraw ether from contract.
    function withDraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}