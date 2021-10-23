// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract DocumentRegistry {
    //Variables
    address internal contractOwner;

    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    mapping (bytes32 => uint256) documents;

    mapping (address => bool) admin;

    bytes32[] hashes;

    uint noOfDocuments;

    uint256 verificationAmount;

    modifier onlyOwner() {
        require (msg.sender == contractOwner, "Only Organization Account is Allowed to add the Blockchain");
        _;
    }

    modifier onlyAdmin() {
        require (admin[msg.sender],"Only Authorized admins can perform this action ");
        _;
    }

    // check if user is an admin

    constructor(uint256 _verificationAmount){
        contractOwner = msg.sender;
        admin[msg.sender] = true;
        verificationAmount = _verificationAmount * (10**18);
    }

    function add(string  memory _firstHash) onlyAdmin() public {
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

    function payVerificationFee() public {
        // user pays verification amount, 
        // only admins are excluded from having to pay the verification amount
            require(
                IERC20Token(cUsdTokenAddress).transferFrom(msg.sender, address(this), verificationAmount),
                "Transfer failed"
            );
    }

    function verify(string memory _clientSideHash) public view returns(uint256){
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

    function isOwner() public view returns(bool){
        if(msg.sender == contractOwner) {
            return true;
        }else{
            return false;
        }
    }

    function isAdmin() public view returns(bool){
        return admin[msg.sender];
    }

    function makeAdmin(address _address) public onlyOwner {
        // add users to the admin group
        admin[_address] = true;   
    }

    function getVerificationAmount() public view returns (uint256) {
        return verificationAmount;
    }

    function withdraw(uint256 _amount) public onlyOwner {
        require(IERC20Token(cUsdTokenAddress).balanceOf(address(this)) >= _amount, "Insuffcient Balance");
        require(IERC20Token(cUsdTokenAddress).transfer(payable(contractOwner), _amount),"Withdrawal failed");
    }
}

