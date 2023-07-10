const fs = require("fs");
const simpleGit = require("simple-git");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

task("updateRound", "update round time")
  .addParam("start", "start timestamp of nowRound")
  .addParam("end", "end timestamp of nowRound")
  .setAction(async (taskArgs, hre) => {
    const airdropConfig = require("../airdrop.config");
    const config = airdropConfig[hre.network.name];
    const airdropAddr = config.airdrop;

    // upodate MerkleRoot
    const tusimaAirdrop = await hre.ethers.getContractAt(
      "TusimaAirdrop",
      airdropAddr
    );

    const tx = await tusimaAirdrop.updateRound(taskArgs.start, taskArgs.end);
    await tx.wait();

    console.log("---- update round time already ----");
  });
