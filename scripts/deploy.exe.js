const hre = require("hardhat");
const web3 = require("web3");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(`====== MockToken Deploying ======`);
  const MockToken = await hre.ethers.getContractFactory("MockToken");
  const mockToken = await MockToken.deploy();
  await mockToken.deployed();

  console.log(`====== TusimaAirDrop Deploying ======`);
  const TusimaAirDrop = await ethers.getContractFactory("TusimaAirDrop");
  console.log("Deploying TusimaAirDrop...");

  const tusimaAirDrop = await upgrades.deployProxy(TusimaAirDrop, [], {
    initializer: "initialize",
    kind: "uups",
  });
  await tusimaAirDrop.deployed();
  console.log("tusimaAirDrop address:",tusimaAirDrop.address);
  return {
    mockToken,
    tusimaAirDrop,
  };
}

exports.execute = async function execute() {
  return await main();
};

