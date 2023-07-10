const hre = require("hardhat");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(`====== MockToken Deploying ======`);

  const airdropConfig = require("../airdrop.config");
  const config = airdropConfig[hre.network.name];

  let token;

  console.log("hre.network.name :", hre.network.name);

  if (hre.network.name == "hardhat") {
    const MockToken = await hre.ethers.getContractFactory("MockToken");
    token = await MockToken.deploy();
    await token.deployed();
  } else {
    token = await hre.ethers.getContractAt("MockToken", config.token);
  }

  console.log(`====== TusimaAirdrop Deploying ======`);
  const TusimaAirdrop = await ethers.getContractFactory("TusimaAirdrop");

  const tusimaAirdrop = await upgrades.deployProxy(TusimaAirdrop, [], {
    initializer: "initialize",
    kind: "uups",
  });
  await tusimaAirdrop.deployed();

  // set token address
  if (hre.network.name != "hardhat") {
    await tusimaAirdrop.setTokenAddr(config.token);
  }


  return {
    token,
    tusimaAirdrop,
  };
}

exports.execute = async function execute() {
  return await main();
};

