const hre = require("hardhat");
const web3 = require("web3");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(`====== OrigamiGovernanceToken Deploying ======`);
  const OrigamiGovernanceToken = await hre.ethers.getContractFactory(
    "OrigamiGovernanceToken"
  );
  //  Deploy logic contract using the proxy pattern.
  const origamiGovernanceToken = await upgrades.deployProxy(
    OrigamiGovernanceToken,

    //Since the logic contract has an initialize() function
    // we need to pass in the arguments to the initialize()
    // function here.
    [
      deployer.address,
      process.env.tokenName,
      process.env.toknSymbol,
      process.env.supplyCap,
    ],
    // We don't need to expressly specify this
    // as the Hardhat runtime will default to the name 'initialize'
    { initializer: "initialize" }
  );
  await origamiGovernanceToken.deployed();
  console.log("origamiGovernanceToken address:",origamiGovernanceToken.address);

  /*
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
  */

  console.log(`====== TusimaAirDrop Deploying ======`);

  const TusimaAirDrop = await ethers.getContractFactory("TusimaAirDrop");
  console.log("Deploying TusimaAirDrop...");
  // 这里添加了参数 => kind: 'uups'
  const tusimaAirDrop = await upgrades.deployProxy(TusimaAirDrop, [], {
    initializer: "initialize",
    kind: "uups",
  });
  await tusimaAirDrop.deployed();
  console.log("tusimaAirDrop address:",tusimaAirDrop.address);

  /*
  console.log("等待兩個網路確認 ... ")
  const receipt = await tusimaAirDrop.deployTransaction.wait(2);

  console.log(
    "邏輯合約地址 getImplementationAddress",
    await upgrades.erc1967.getImplementationAddress(tusimaAirDrop.address)
  );
  */

  // console.log("====== updateRound ======");
  // await tusimaAirDrop.updateRound(await time.latest(), await time.latest()+7200);
  // console.log("============= mint to tusimaAirDrop =============");
  // const mintValue = ethers.utils.parseUnits(100000000, "ether");
  // await tsm.mint(tusimaAirDrop.address, mintValue);

  return {
    origamiGovernanceToken,
    tusimaAirDrop,
  };
}

exports.execute = async function execute() {
  return await main();
};

