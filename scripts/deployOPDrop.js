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
  const OPDrop = await ethers.getContractFactory("OPDrop");
  console.log("Deploying OPDrop...");
  // 这里添加了参数 => kind: 'uups'
  const opDrop = await upgrades.deployProxy(
    OPDrop,
    [
      tsm.address,
      web3.utils.hexToBytes(
        "0x4006d50d2974e0c6714a59c90d55b696578b77aeeceacd81f4791a8d72170b34"
      ),
      await time.latest(),
      (await time.latest()) + 7200,
    ],
    { initializer: "initialize", kind: "uups" }
  );

  console.log("OPDrop deployed to:", opDrop.address);

  // console.log("等待兩個網路確認 ... ")
  // const receipt = await opDrop.deployTransaction.wait(2);

  // console.log(
  //   "邏輯合約地址 getImplementationAddress",
  //   await upgrades.erc1967.getImplementationAddress(opDrop.address)
  // );

  // console.log("============= mint to opDrop =============");
  // const mintValue = ethers.utils.parseUnits(100000000, "ether");
  // await tsm.mint(opDrop.address, mintValue);

  return {
    tsm,
    opDrop,
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


