// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

contract TusimaAirDrop is Initializable,OwnableUpgradeable,UUPSUpgradeable{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    uint8 public currRound;
    address public tokenAddr;
    bytes32 public merkleRoot;

    struct Round{
        uint256 start;
        uint256 end;
    }

    mapping(uint8=>Round) public roundMap;
    mapping(address=> mapping(uint8=>bool)) public claimed;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    event Claim(uint8 round, address claimer, uint256 amount);

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function newRound(uint256 _star, uint256 _end) external onlyOwner(){
        require(block.timestamp > roundMap[currRound].end, "cannot create new round");
        currRound += 1;
        roundMap[currRound] = Round(_star, _end);
    }

    function updateRound(uint256 _start, uint256 _end) external onlyOwner(){
        uint8 round = currRound;
        require(_start > 0 && _start < _end, "invalid round");
        roundMap[round].start = _start;
        roundMap[round].end = _end;
    }

    function updateMerkleRoot(bytes32 _merkleRoot) external onlyOwner(){
        merkleRoot = _merkleRoot;
    }

    function claim(bytes32[] calldata _merkleProof,uint256 _amount) external {
        require(
            roundMap[currRound].start <= block.timestamp && 
            block.timestamp <= roundMap[currRound].end, 
            "wrong time"
        );
        require(!claimed[msg.sender][currRound], "Address already claimed");

        bytes32 leaf = _leaf(msg.sender, _amount);
        require(_verify(leaf, _merkleProof), "Invalid merkle proof");
        
        claimed[msg.sender][currRound] = true;
        IERC20Upgradeable(tokenAddr).safeTransfer(msg.sender, _amount);

        emit Claim(currRound, msg.sender, _amount);
    }

    function setTokenAddr(address _tokenAddress) external onlyOwner(){
        tokenAddr = _tokenAddress;
    }

    function tokenClaimBack(address _tokenAddr, address _receiver, uint256 _amount) external onlyOwner(){
        require(roundMap[currRound].end < block.timestamp, "cannot claim");
        IERC20Upgradeable(_tokenAddr).safeTransfer(_receiver, _amount);
    }
    
    function _leaf(address account,uint256 amount) internal pure returns (bytes32){
        return keccak256(abi.encodePacked(account,amount));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof) internal view returns (bool){
        return MerkleProofUpgradeable.verify(proof, merkleRoot, leaf);
    }
}

