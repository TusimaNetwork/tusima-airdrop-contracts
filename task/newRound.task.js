const fs = require("fs");
const simpleGit = require("simple-git");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

task("newRound", "start a new round")
  .addParam("path", "The excel file path")
  .addParam("sheet", "The sheet of the data")
  .addParam("start", "start timestamp of newRound")
  .addParam("end", "end timestamp of newRound")
  .setAction(async (taskArgs, hre) => {
    const xlsx = require("node-xlsx");
    const sheets = xlsx.parse(taskArgs.path);
    const sheet = sheets[taskArgs.sheet];

    const tree = StandardMerkleTree.of(sheet.data, ["address", "uint256"]);
    await fs.writeFileSync(
      "./tusima-airdrop-merkledata/airDrop.json",
      JSON.stringify(tree.dump())
    );
    console.log("---- translate to json finished already ----");

    // upload json to github
    git = simpleGit(`${process.cwd()}/tusima-airdrop-merkledata/`, {
      binary: "git",
    });
    await git.pull();
    await git.checkout("test");
    await git.add("./");
    await git.commit("update json");
    await git.push();

    console.log("---- upload json to github already ----");

    const airdropConfig = require("../airdrop.config");
    const config = airdropConfig[hre.network.name];
    const airdropAddr = config.airdrop;

    // upodate MerkleRoot
    const tusimaAirdrop = await hre.ethers.getContractAt(
      "TusimaAirdrop",
      airdropAddr
    );

    const updateTx = await tusimaAirdrop.updateMerkleRoot(tree.root);
    await updateTx.wait();

    console.log("---- update MerkleRoot already ----");

    const newTx = await tusimaAirdrop.newRound(taskArgs.start, taskArgs.end);
    await newTx.wait();

    console.log("---- start a new round already ----");
  });
