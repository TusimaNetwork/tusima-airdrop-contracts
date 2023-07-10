// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is Ownable,ERC20 {
    constructor() ERC20("Mock","Mock"){}

    function mint(address receiver,uint256 amount) external onlyOwner(){
        _mint(receiver, amount);
    } 
}