const ethers = require("ethers");
const bip39 = require("bip39");
const HDWallet = require("ethereum-hdwallet");
const fs = require("fs");
// const { Web3 } = require("web3");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

const run = () => {
  task("update", "transfer data from excel to json").setAction(async () => {
    const xlsx = require("node-xlsx");
    const excelFilePath = "./airdrop.xls";
    const sheets = xlsx.parse(excelFilePath);
    const sheet = sheets[3];

    const tree = StandardMerkleTree.of(sheet.data, ["address", "uint256"]);
    await fs.writeFileSync(
      "./tusima-airdrop-merkledata/airDrop.json",
      JSON.stringify(tree.dump())
    );
    console.log("---- translate to json finished already ----");

    const provider = new ethers.providers.JsonRpcProvider(
      `https://opt-goerli.g.alchemy.com/v2/${process.env.Optimism_End_Point}`
    );


  //get wallet
  const seed = await bip39.mnemonicToSeed(process.env.MNEMONIC); 
  const hdwallet = HDWallet.fromSeed(seed);
  const key = hdwallet.derive("m/44'/60'/0'/0/0");
  const wallet = new ethers.Wallet(key.getPrivateKey(), provider);

  const EthAddress = '0x' + key.getAddress().toString('hex');
  console.log("Eth Address = " + EthAddress);


  //ABI
  const dropAbi = ["function updateMerkleRoot(bytes32) external"];
  
  const TusimaAirDrop = new ethers.Contract(
    process.env.airDropAddress,
    dropAbi,
    wallet
  );

  const tx = await TusimaAirDrop.updateMerkleRoot(tree.root);
  await tx.wait();
  });
};

module.exports = {
  run,
};
