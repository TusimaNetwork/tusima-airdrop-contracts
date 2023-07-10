// const { ethers } = require("hardhat");
const fs = require("fs");
const { Web3 } = require("web3");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

const run = ()=>{
task("update", "transfer data from excel to json").setAction(async () => {
  const xlsx = require("node-xlsx");
  const excelFilePath = "./airdrop.xls";
  const sheets = xlsx.parse(excelFilePath);
  const sheet = sheets[3];

  const tree = StandardMerkleTree.of(sheet.data, ["address", "uint256"]);
  await fs.writeFileSync("airDrop.json", JSON.stringify(tree.dump()));
  console.log("---- translate to json finished already ----");

  const web3 = new Web3(`https://opt-goerli.g.alchemy.com/v2/${process.env.Optimism_End_Point}`);
  //const TusimaAirDrop = fs.readFileSync('./artifacts/contracts/tusimaAirDrop.sol/TusimaAirDrop.json', 'utf8');
  const TusimaAirDrop = require("../artifacts/contracts/tusimaAirDrop.sol/TusimaAirDrop.json");
  //let tusimaAirDrop = JSON.parse(TusimaAirDrop);
  const contract = new web3.eth.Contract(TusimaAirDrop.abi, process.env.airDropAddress);
  //const contract = await ethers.getContractAt("TusimaAirDrop", process.env.airDropAddress);
  await contract.methods.updateMerkleRoot(tree.root).call((error, result) => {
    if (error) {
      console.error(error);
    } else {
      console.log(result);
    }
  });
});

}

module.exports={
    run
}