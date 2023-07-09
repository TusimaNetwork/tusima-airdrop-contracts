#  tusima-airdrop-contracts

This document provides a quick and easy guide to deploy **tusima-airdrop-contracts**. This is an airdrop project based on Merkle proof。

## Requirements

- Hardware
  - cpu: intel_x64
  - memory: 20G
- Software
  - System: macOS、Windows10、Linux, x86_64
  - Nodejs v16+
  - Hardhat、Foundry

## Deployment

To download project with `Access_Token`:

```
git clone https://<access_token>@github.com/TusimaNetwork/tusima-airdrop-contracts.git
```

> how to get github access_token: [Github Docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)



install the required dependencies inside the relevant folders:

```
yarn
forge install
```

Deploy **tusimaAirDrop** only:

```
npx hardhat run scripts/deployTusimaArbDrop.js --network arbitrumGoerli
```

> if you wang to deploy in another network, add network config in hardhat.config.js



Run test script:

```
npx hardhat test test/airdrop.test.js
```

