// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";

contract ArbDrop is Initializable,OwnableUpgradeable,UUPSUpgradeable{
    using SafeERC20 for IERC20;

    address public tokenAddr;
    bytes32 public merkleRoot;
    uint256 public startTime;
    uint256 public endTime;
    mapping(bytes32=>bool) claimed;

    function initialize(address _tokenAddress,bytes32 _merkleRoot,uint256 _startTime,uint256 _endTime) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        tokenAddr = _tokenAddress;
        merkleRoot = _merkleRoot;
        startTime = _startTime;
        endTime = _endTime;
    }

    event Claim(address claimer,uint256 amount,uint8 round,uint256 timestamp);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function changeRoot(bytes32 _root) external onlyOwner(){
        merkleRoot = _root;
    }

    function changeTokenAddress(address _tokenAddress) external onlyOwner(){
        tokenAddr = _tokenAddress;
    }

    function changeTime(uint256 _startTime,uint256 _stopTime) external onlyOwner(){
        startTime = _startTime;
        endTime = _stopTime;
    }

    function tokenClaimBack(uint256 amount) external onlyOwner(){
        IERC20(tokenAddr).safeTransferFrom(address(this), msg.sender, amount);
    }

    modifier isValidTime() {
        require(startTime <= block.timestamp && block.timestamp <= endTime);
        _;
    }

    function getDrop(bytes32[] calldata merkleProof,uint256 amount,uint8 round) external isValidTime(){
        
        bytes32 leaf = _leaf(msg.sender,round,amount);

        require(_verify(leaf, merkleProof), "Invalid merkle proof");

        require(!claimed[leaf], "Address already claimed");
        claimed[leaf] = true;
        IERC20(tokenAddr).safeTransfer(msg.sender, amount);

        emit Claim(msg.sender, amount, round, block.timestamp);
    }
    
    function _leaf(address account, uint8 round,uint256 amount) internal pure returns (bytes32){
        return keccak256(abi.encodePacked(account,amount,round));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof) internal view returns (bool){
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }
}

