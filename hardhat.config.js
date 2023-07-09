require("dotenv").config({ override: true });
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-foundry");
const fs = require("fs");
const { Web3 } = require("web3");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

task("build", "transfer data from excel to json").setAction(async () => {
  const xlsx = require("node-xlsx");
  const excelFilePath = "./airdrop.xlsx";
  const sheets = xlsx.parse(excelFilePath);
  const sheet = sheets[0];

  const tree = StandardMerkleTree.of(sheet.data, ["address", "uint256"]);
  await fs.writeFileSync("airDrop.json", JSON.stringify(tree.dump()));
  console.log("---- translate to json finished already ----");

  const web3 = new Web3(`https://opt-goerli.g.alchemy.com/v2/${process.env.Optimism_End_Point}`);
  const TusimaAirDrop = fs.readFileSync('./artifacts/contracts/tusimaAirDrop.sol/TusimaAirDrop.json', 'utf8');
  let tusimaAirDrop = JSON.parse(TusimaAirDrop);
  const contract = new web3.eth.Contract(tusimaAirDrop.abi, process.env.airDropAddress);
  await contract.methods.updateMerkleRoot(tree.root).call((error, result) => {
    if (error) {
      console.error(error);
    } else {
      console.log(result);
    }
  });
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      { version: "0.8.9" },
    ],
  },
  networks: {
    arbitrumOne: {
      url: `${process.env.ArbitrumOne_END_POINT}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
    arbitrumGoerli: {
      // url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_END_POINT}`,
      url: "https://goerli-rollup.arbitrum.io/rpc",
      chainId: 421613,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
    optimism: {
      url: `${process.env.ArbitrumOne_END_POINT}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
    optimismGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${process.env.Optimism_End_Point}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
  },
  etherscan: {
    apiKey: {
      optimisticGoerli: process.env.OPTIMISM_API_KEY,
    },
  },
};
