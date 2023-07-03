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
  const ArbDrop = await ethers.getContractFactory("ArbDrop");
  console.log("Deploying ArbDrop...");
  // 这里添加了参数 => kind: 'uups'
  const arbDrop = await upgrades.deployProxy(
    ArbDrop,
    [
      tsm.address,
      web3.utils.hexToBytes(
        "0x92bc77bd2d8fe4ac585d0f31a563525490abc6c565409a7eb0fa37941c71731b"
      ),
      await time.latest(),
      (await time.latest()) + 7200,
    ],
    { initializer: "initialize", kind: "uups" }
  );

  console.log("ArbDrop deployed to:", arbDrop.address);

  // console.log("等待兩個網路確認 ... ")
  // const receipt = await arbDrop.deployTransaction.wait(2);

  // console.log(
  //   "邏輯合約地址 getImplementationAddress",
  //   await upgrades.erc1967.getImplementationAddress(arbDrop.address)
  // );

  return {
    tsm,
    arbDrop
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


