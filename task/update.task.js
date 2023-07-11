const fs = require("fs");
const simpleGit = require("simple-git");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

task("update", "transfer data from excel to json")
  .addParam("path", "The excel file path")
  .addParam("sheet", "The sheet of the data")
  .addParam("branch", "The branch of json upload")
  .setAction(async (taskArgs, hre) => {
    const xlsx = require("node-xlsx");
    const sheets = xlsx.parse(taskArgs.path);
    const sheet = sheets[taskArgs.sheet];

    const tree = StandardMerkleTree.of(sheet.data, ["address", "uint256"]);

    // upload json to github
    git = simpleGit(`${process.cwd()}/tusima-airdrop-merkledata/`, {
      binary: "git",
    });
    await git.pull();
    await git.checkout(taskArgs.branch);

    await fs.writeFileSync(
      "./tusima-airdrop-merkledata/airDrop.json",
      JSON.stringify(tree.dump())
    );
    console.log("---- translate to json finished already ----");

    await git.add("./");
    await git.commit("update json");
    await git.push();

    console.log("---- upload json to github already ----");

    const airdropConfig = require("../airdrop.config");
    const config = airdropConfig[hre.network.name];
    const airdropAddr = config.airdrop;

    // update MerkleRoot
    const tusimaAirdrop = await hre.ethers.getContractAt(
      "TusimaAirdrop",
      airdropAddr
    );

    const tx = await tusimaAirdrop.updateMerkleRoot(tree.root);
    await tx.wait();

    console.log("---- update MerkleRoot already ----");
  });
