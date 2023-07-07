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

    struct RoundInfo{
        address tokenAddr;
        bytes32 merkleRoot;
        uint256 startTime;
        uint256 endTime;
    }

    mapping(uint8=>RoundInfo) public roundInfos;
    mapping(bytes32=>bool) public claimed;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    event Claim(uint8 round,address claimer,uint256 amount,uint256 timestamp);

    function initialize(address _tokenAddress,bytes32 _merkleRoot,uint256 _startTime,uint256 _endTime) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();

        roundInfos[0] =RoundInfo({
            tokenAddr:_tokenAddress,
            merkleRoot:_merkleRoot,
            startTime:_startTime,
            endTime:_endTime
        });
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function changeRoundInfo(uint8 _round,address _tokenAddress,bytes32 _merkleRoot,uint256 _startTime,uint256 _endTime) external onlyOwner(){
        roundInfos[_round] =RoundInfo({
            tokenAddr:_tokenAddress,
            merkleRoot:_merkleRoot,
            startTime:_startTime,
            endTime:_endTime
        });

    }

    function tokenClaimBack(address _tokenAddr,address _receiver,uint256 _amount) external onlyOwner(){
        IERC20Upgradeable(_tokenAddr).safeTransfer(_receiver, _amount);
    }

    modifier isValidTime(uint8 _round) {
        require(roundInfos[_round].startTime <= block.timestamp && block.timestamp <= roundInfos[_round].endTime,"wrong time");
        _;
    }

    function getDrop(bytes32[] calldata _merkleProof,uint256 _amount,uint8 _round) external isValidTime(_round){
        
        bytes32 leaf = _leaf(msg.sender,_round,_amount);

        require(_verify(_round,leaf,_merkleProof), "Invalid merkle proof");
        require(!claimed[leaf], "Address already claimed");

        claimed[leaf] = true;
        IERC20Upgradeable(roundInfos[_round].tokenAddr).safeTransfer(msg.sender, _amount);

        emit Claim(_round, msg.sender, _amount, block.timestamp);
    }
    
    function _leaf(address account, uint8 round,uint256 amount) internal pure returns (bytes32){
        return keccak256(abi.encodePacked(account,amount,round));
    }

    function _verify(uint8 _round, bytes32 leaf, bytes32[] memory proof) internal view returns (bool){
        return MerkleProofUpgradeable.verify(proof, roundInfos[_round].merkleRoot, leaf);
    }
}

