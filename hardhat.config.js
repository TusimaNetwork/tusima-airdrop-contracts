require("dotenv").config({ override: true });
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-foundry");

//newRound task
require("./task/newRound.task");

//updateRound task
require("./task/updateRound.task");

//update task
require("./task/update.task");

require("./task/accounts.task");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.16",
        settings: {
          optimizer: {
            enabled: false,
            runs: 200,
          },
        },
      },
    ],
  },
  // defaultNetwork: "optimismGoerli",
  networks: {
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${process.env.Optimism_End_Point}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        // path: "m/44'/60'/0'/0",
        // initialIndex: 0,
        // count: 20,
        // passphrase: "",
      },
    },
    optimismGoerli: {
      url: `https://opt-goerli.g.alchemy.com/v2/${process.env.OptimismGoerli_End_Point}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        // path: "m/44'/60'/0'/0",
        // initialIndex: 0,
        // count: 20,
        // passphrase: "",
      },
    },
  },
  etherscan: {
    apiKey: {
      optimisticGoerli: process.env.OPTIMISM_API_KEY,
    },
  },
};
