const hre = require("hardhat");
const web3 = require("web3");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {

  const TusimaAirDrop = await ethers.getContractFactory("TusimaAirDrop");
  console.log("Deploying TusimaAirDrop...");
  // 这里添加了参数 => kind: 'uups'
  const tusimaAirDrop = await upgrades.deployProxy(
    TusimaAirDrop,
    [],
    { initializer: "initialize", kind: "uups" }
  );

  console.log("TusimaAirDrop deployed to:", tusimaAirDrop.address);

  console.log("等待兩個網路確認 ... ")
  const receipt = await tusimaAirDrop.deployTransaction.wait(2);

  console.log(
    "邏輯合約地址 getImplementationAddress",
    await upgrades.erc1967.getImplementationAddress(tusimaAirDrop.address)
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


