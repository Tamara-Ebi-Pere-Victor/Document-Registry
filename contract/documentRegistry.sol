// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract DocumentRegistry {
    address internal contractOwner;

    mapping (bytes32 => uint256) documents;

    mapping (address => bool) admin;

    bytes32[] hashes;

    uint noOfDocuments;

    modifier onlyOwner() {
        require (msg.sender == contractOwner, "Only Organization Account is Allowed to add the Blockchain");
     
        _;
    }

    // check if user is an admin

    modifier onlyAdmin() { 
        isAdmin();
        _;
    }

    constructor(){
        contractOwner = msg.sender;
    }

    function add(string  memory _firstHash) onlyOwner() public {
        // get the time from the blockchain
        uint timeAdded = block.timestamp;
        // encode again with keccak256
        bytes32 hashBytes = keccak256(abi.encodePacked(_firstHash));
        // store the hash in the mapping
        documents[hashBytes] = timeAdded;
        // store hash result in the list of hashes
        hashes.push(hashBytes);
        // update the number of documents updated
        noOfDocuments++;
    }

    function verify(string memory _clientSideHash) public view returns (uint256) {
        // encode the hash with keccak256
        bytes32 hashBytes = keccak256(abi.encodePacked(_clientSideHash));
        // check the mapping if it exists
        return documents[hashBytes];
    }

    function getNoOfDocs() public view returns(uint256){
        // returns no of documents
        return noOfDocuments;  
    }

    function gethashes() public view returns(bytes32[] memory) {
        // returns the hashes array
        return hashes;
    }

    function getDocument(bytes32 _documentHash) public view returns (bytes32){
        uint _doc =  documents[_documentHash];

        return hashes[_doc];
    }

    function isAdmin() public view returns(bool){
        if(msg.sender == contractOwner) {
            return true;
        }else{
            return false;
        }
    }

    function makeAdmin(address _address) public onlyOwner {
        admin[_address] = true;
        
    }

}

