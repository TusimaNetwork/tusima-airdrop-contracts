const hre = require("hardhat");
const { ethers } = require("hardhat");

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
      JSON.parse(process.env.lightClients),
      new Date().getTime(),
      new Date().getTime()+7200
    ],
    { initializer: "initialize", kind: "uups" }
  );

  console.log("ArbDrop deployed to:", arbDrop.address);

  console.log("等待兩個網路確認 ... ")
  const receipt = await arbDrop.deployTransaction.wait(2);

  console.log(
    "邏輯合約地址 getImplementationAddress",
    await upgrades.erc1967.getImplementationAddress(arbDrop.address)
  );

  console.Console.log("====== mint to arbdrop ======");

  await tsm.mint(arbDrop.address,ethers.utils.parseUnits("1000000","ether"));

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


