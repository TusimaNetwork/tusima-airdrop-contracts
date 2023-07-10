const fs = require("fs");
const simpleGit = require("simple-git");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

task("newRound", "start a new round")
  .addParam("start", "start timestamp of newRound")
  .addParam("end", "end timestamp of newRound")
  .setAction(async (taskArgs, hre) => {

    const airdropConfig = require("../airdrop.config");
    const config = airdropConfig[hre.network.name];
    const airdropAddr = config.airdrop;

    // start a new round
    const tusimaAirdrop = await hre.ethers.getContractAt(
      "TusimaAirdrop",
      airdropAddr
    );

    const newTx = await tusimaAirdrop.newRound(taskArgs.start, taskArgs.end);
    await newTx.wait();

    console.log("---- start a new round already ----");
  });
