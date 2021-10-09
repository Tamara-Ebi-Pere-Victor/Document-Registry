// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract DocumentRegistry {
    address internal contractOwner;

    mapping (string => uint256) documents;

    modifier onlyOwner() {
        require (msg.sender == contractOwner, "Only Organization Account is Allowed to add the Blockchain");
        _;
    }

    constructor(){
        contractOwner = msg.sender;
    }

    function add(string memory hash) onlyOwner() public returns (uint256 dateAdded) {
        uint timeAdded = block.timestamp;
        documents[hash] = timeAdded;
        return timeAdded;
    }

    function verify(string memory hash) public view returns (uint256 dateAdded) {
        return documents[hash];
    }
}

