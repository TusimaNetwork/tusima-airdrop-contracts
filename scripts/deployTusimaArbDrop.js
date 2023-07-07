const hre = require("hardhat");
const web3 = require("web3");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const TSM = await hre.ethers.getContractFactory("TSM");
  const tsm = await TSM.deploy();
  await tsm.deployed();

  console.log(`TSM deployed to ${tsm.address}`);

  // Router
  const TusimaAirDrop = await ethers.getContractFactory("TusimaAirDrop");
  console.log("Deploying TusimaAirDrop...");
  // 这里添加了参数 => kind: 'uups'
  const tusimaAirDrop = await upgrades.deployProxy(
    TusimaAirDrop,
    [],
    { initializer: "initialize", kind: "uups" }
  );

  console.log("TusimaAirDrop deployed to:", tusimaAirDrop.address);

  // console.log("====== updateRound ======");
  // await tusimaAirDrop.updateRound(await time.latest(), await time.latest()+7200);



  // console.log("等待兩個網路確認 ... ")
  // const receipt = await tusimaAirDrop.deployTransaction.wait(2);

  // console.log(
  //   "邏輯合約地址 getImplementationAddress",
  //   await upgrades.erc1967.getImplementationAddress(tusimaAirDrop.address)
  // );

  // console.log("============= mint to tusimaAirDrop =============");
  // const mintValue = ethers.utils.parseUnits(100000000, "ether");
  // await tsm.mint(tusimaAirDrop.address, mintValue);

  return {
    tsm,
    tusimaAirDrop,
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

exports.execute = async function execute() {
  return await main();
};

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


