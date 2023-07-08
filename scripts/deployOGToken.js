const hre = require("hardhat");
const web3 = require("web3");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const OrigamiGovernanceToken = await hre.ethers.getContractFactory(
    "OrigamiGovernanceToken"
  );
  //  Deploy logic contract using the proxy pattern.
  const origamiGovernanceToken = await upgrades.deployProxy(
    OrigamiGovernanceToken,

    //Since the logic contract has an initialize() function
    // we need to pass in the arguments to the initialize()
    // function here.
    [deployer.address, "Collab.Land", "COLLAB", "1000000000000000000000000000"],
    // We don't need to expressly specify this
    // as the Hardhat runtime will default to the name 'initialize'
    { initializer: "initialize" }
  );
  await origamiGovernanceToken.deployed();

  // proxy address
  const proxyAddress = origamiGovernanceToken.address;

  // implementationAddress
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    origamiGovernanceToken.address
  );
  // proxyAdmin 合约地址
  const adminAddress = await upgrades.erc1967.getAdminAddress(
    origamiGovernanceToken.address
  );

  console.log(`proxyAddress: ${proxyAddress}`);
  console.log(`implementationAddress: ${implementationAddress}`);
  console.log(`adminAddress: ${adminAddress}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
