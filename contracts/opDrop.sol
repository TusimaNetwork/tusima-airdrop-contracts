// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";

contract OPDrop is Initializable,OwnableUpgradeable,UUPSUpgradeable{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    uint8 public nowRound;
    address public tokenAddr;
    bytes32 public merkleRoot;

    struct RoundTime{
        uint256 startTime;
        uint256 endTime;
    }

    mapping(uint8=>RoundTime) public roundTimes;
    mapping(address=> mapping(uint8=>bool)) public claimed;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    event Claim(uint8 round,address claimer,uint256 amount,uint256 timestamp);

    function initialize() public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function changeRoundTime(uint8 _round,uint256 _startTime,uint256 _endTime) external onlyOwner(){
        roundTimes[_round] =RoundTime({
            startTime:_startTime,
            endTime:_endTime
        });
    }
    function changeTokenAddr(address _tokenAddress) external onlyOwner(){
        tokenAddr = _tokenAddress;
    }

    function changeNowRound(uint8 _nowRound) external onlyOwner(){
        nowRound = _nowRound;
    }

    function changeMerkleRoot(bytes32 _merkleRoot) external onlyOwner(){
        merkleRoot=_merkleRoot;
    }

    function tokenClaimBack(address _tokenAddr,address _receiver,uint256 _amount) external onlyOwner(){
        IERC20Upgradeable(_tokenAddr).safeTransfer(_receiver, _amount);
    }

    modifier isValidTime() {
        require(roundTimes[nowRound].startTime <= block.timestamp && block.timestamp <= roundTimes[nowRound].endTime,"wrong time");
        _;
    }

    function getDrop(bytes32[] calldata _merkleProof,uint256 _amount) external isValidTime(){
        
        bytes32 leaf = _leaf(msg.sender,_amount);

        require(_verify(leaf,_merkleProof), "Invalid merkle proof");
        require(!claimed[msg.sender][nowRound], "Address already claimed");

        claimed[msg.sender][nowRound] = true;
        IERC20Upgradeable(tokenAddr).safeTransfer(msg.sender, _amount);

        emit Claim(nowRound, msg.sender, _amount, block.timestamp);
    }
    
    function _leaf(address account,uint256 amount) internal pure returns (bytes32){
        return keccak256(abi.encodePacked(account,amount));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof) internal view returns (bool){
        return MerkleProofUpgradeable.verify(proof, merkleRoot, leaf);
    }
}

