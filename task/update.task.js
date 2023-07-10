const fs = require("fs");
const bip39 = require("bip39");
const ethers = require("ethers");
const simpleGit = require("simple-git");
const HDWallet = require("ethereum-hdwallet");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

const run = () => {
  task("update", "transfer data from excel to json")
    .addParam("path", "The excel file path")
    .setAction(async (taskArgs) => {
      const xlsx = require("node-xlsx");
      const sheets = xlsx.parse(taskArgs.path);
      const sheet = sheets[3];

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

      // let git = null;
      // pushJsonDataToGit;

      console.log("---- upload json to github already ----");

      const provider = new ethers.providers.JsonRpcProvider(
        `https://opt-goerli.g.alchemy.com/v2/${process.env.Optimism_End_Point}`
      );

      //get wallet
      const seed = await bip39.mnemonicToSeed(process.env.MNEMONIC);
      const hdwallet = HDWallet.fromSeed(seed);

      //first address
      const key = hdwallet.derive("m/44'/60'/0'/0/0");
      const wallet = new ethers.Wallet(key.getPrivateKey(), provider);

      //ABI
      const dropAbi = ["function updateMerkleRoot(bytes32) external"];

      const TusimaAirDrop = new ethers.Contract(
        process.env.airDropAddress,
        dropAbi,
        wallet
      );

      const tx = await TusimaAirDrop.updateMerkleRoot(tree.root);
      await tx.wait();

      console.log("---- update MerkleRoot already ----");
    });
};

async function pushJsonDataToGit() {
  if (git == null) {
    git = simpleGit(`${process.cwd()}/tusima-airdrop-merkledata/`, {
      binary: "git",
    });
  }

  await git.pull();
  await git.add("./");
  await git.commit("update json");
  await git.push();
}

module.exports = {
  run,
};
