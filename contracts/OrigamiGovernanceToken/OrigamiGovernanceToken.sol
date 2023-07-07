// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IVotes} from "contracts/OrigamiGovernanceToken/interfaces/IVotes.sol";
import {IVotesToken} from "contracts/OrigamiGovernanceToken/interfaces/IVotesToken.sol";
import {TransferLocks} from "contracts/OrigamiGovernanceToken/utils/TransferLocks.sol";
import {Votes} from "contracts/OrigamiGovernanceToken/utils/Votes.sol";
import {ERC20Base} from "contracts/OrigamiGovernanceToken/token/governance/ERC20Base.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {L2StandardERC20} from "contracts/OrigamiGovernanceToken/utils/L2StandardERC20.sol";

/**
 * @title Origami Governance Token
 * @author Origami
 * @notice This contract is an ERC20 token used for DAO governance functions and is supported and depended upon by the Origami platform and ecosystem.
 * @custom:security-contact contract-security@joinorigami.com
 */
contract OrigamiGovernanceToken is ERC20Base, TransferLocks, L2StandardERC20, Votes {
    /**
     * @notice the constructor is not used since the contract is upgradeable except to disable initializers in the implementations that are deployed.
     * @custom:oz-upgrades-unsafe-allow constructor
     */
    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc ERC20Base
    function name() public view virtual override(ERC20Base, IVotesToken) returns (string memory) {
        return super.name();
    }

    /**
     * @notice returns the EIP-712 version number for this token.
     */
    function version() public pure returns (string memory) {
        return "1.0.0";
    }

    /// @inheritdoc ERC20Base
    function mint(address to, uint256 amount)
        public
        virtual
        override(ERC20Base, L2StandardERC20)
        onlyRole(MINTER_ROLE)
    {
        super.mint(to, amount);
    }

    /// @inheritdoc ERC20Upgradeable
    function balanceOf(address owner) public view override(ERC20Base, IVotesToken) returns (uint256) {
        return super.balanceOf(owner);
    }

    /**
     * @inheritdoc ERC20Upgradeable
     * @dev this is overridden so we can apply the `whenTransferrable` modifier
     */
    function transferFrom(address from, address to, uint256 amount)
        public
        virtual
        override(ERC20Base)
        whenTransferrable
        returns (bool)
    {
        return super.transferFrom(from, to, amount);
    }

    /**
     * @inheritdoc ERC20Upgradeable
     * @dev this is overridden so we can apply the `whenTransferrable` modifier
     */
    function transfer(address to, uint256 amount) public virtual override(ERC20Base) whenTransferrable returns (bool) {
        return super.transfer(to, amount);
    }

    /// @inheritdoc ERC20Base
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC20Base, L2StandardERC20, TransferLocks)
        returns (bool)
    {
        return interfaceId == type(IVotes).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @inheritdoc ERC20Upgradeable
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20Base, TransferLocks)
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    /// @inheritdoc ERC20Upgradeable
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20Upgradeable) {
        transferVotingUnits(from, to, amount);
        super._afterTokenTransfer(from, to, amount);
    }
}
