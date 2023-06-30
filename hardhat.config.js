require("dotenv").config({ override: true });
require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

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
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_END_POINT}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_END_POINT}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
    chiado: {
      url: `${process.env.CHIADO_END_POINT}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: "",
      },
    },
    bsctest: {
      url: `${process.env.BSCTEST_END_POINT}`,
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
      goerli: process.env.ETHSCAN_API_KEY,
      sepolia: process.env.ETHSCAN_API_KEY,
      bscTestnet: process.env.BSCSCAN_API_KEY,
      gnosis: process.env.GENOSIS_API_KEY,
      chiado: process.env.GENOSIS_API_KEY,
    },
  },
};
