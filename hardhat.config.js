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
            enabled: false,
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
      arbitrumGoerli: process.env.ARBITRUM_API_KEY,
      optimismGoerli: process.env.OPTIMISM_API_KEY,
    },
  },
};
