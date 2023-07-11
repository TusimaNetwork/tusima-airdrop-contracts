#  tusima-airdrop-contracts

This document provides a quick and easy guide to deploy **tusima-airdrop-contracts**. This is an airdrop project based on Merkle proof。

## Requirements

- Software
  - System: macOS、Windows10、Linux, x86_64
  - Nodejs v16+

## Deployment

install the required dependencies inside the relevant folders:

```
yarn
```

create .env file 
```
# 
MNEMONIC= 

# Optimism mainnet end point
Optimism_End_Point=

# Optimism goerli testnet end point
OptimismGoerli_End_Point=

# etherscan api,used for contract verify
OPTIMISM_API_KEY=
```

Deploy **tusimaAirDrop** :

```
npx hardhat run scripts/deploy.js --network <network>
```

> if you want to deploy in another network, add network config in hardhat.config.js

Verify **tusimaAirDrop** :
```
npx hardhat verify --network <network> --contract contracts/tusimaAirdrop.sol:TusimaAirdrop <tusimaAirDrop implementationAddress>
```


Run test script:

```
npx hardhat test test/airdrop.test.js
```



## Task

#### newRound

```
npx hardhat updateRound --start startTime --end endTime --network <network>
```

This task is used to start a new round within the set time.

#### updateRound

````
npx hardhat updateRound --start startTime --end endTime --network <network>
````

This task is used to update the start and end time of the current round.

#### update

```
npx hardhat update --path excelFilePath --sheet sheetNum --network <network>
```

This task is used for 

-  Convert the data in excel to json file 
- Upload the generated json file to github 
- Update the MerkleRoot of the contract

