// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract DocumentRegistry {
    address internal contractOwner;

    uint236 _amount = 3;

    mapping(bytes32 => uint256) documents;

    bytes32[] hashes;

    uint256 noOfDocuments;

    modifier onlyOwner() {
        require(
            msg.sender == contractOwner,
            "Only Organization Account is Allowed to add the Blockchain"
        );
        _;
    }

    constructor() {
        contractOwner = msg.sender;
    }

    function add(string memory _firstHash) public onlyOwner {
        // get the time from the blockchain
        uint256 timeAdded = block.timestamp;
        // encode again with keccak256
        bytes32 hashBytes = keccak256(abi.encodePacked(_firstHash));
        // store the hash in the mapping
        documents[hashBytes] = timeAdded;
        // store hash result in the list of hashes
        hashes.push(hashBytes);
        // update the number of documents updated
        noOfDocuments++;
    }

    function verify(string memory _clientSideHash)
        public
        view
        returns (uint256)
    {
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "Verification failed."
        );
        // encode the hash with keccak256
        bytes32 hashBytes = keccak256(abi.encodePacked(_clientSideHash));
        // check the mapping if it exists
        return documents[hashBytes];
    }

    function getNoOfDocs() public view returns (uint256) {
        // returns no of documents
        return noOfDocuments;
    }

    function gethashes() public view returns (bytes32[] memory) {
        // returns the hashes array
        return hashes;
    }

    function isAdmin() public view returns (bool) {
        if (msg.sender == contractOwner) {
            return true;
        } else {
            return false;
        }
    }
}
