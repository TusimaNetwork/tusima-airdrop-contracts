#  tusima-airdrop-contracts

This document provides a quick and easy guide to deploy **tusima-airdrop-contracts**. This is an airdrop project based on Merkle proof。

## Requirements

- Software
  - System: macOS、Windows10、Linux, x86_64
  - Nodejs v16+

## Deployment

To download project with `Access_Token`:

```
git clone https://<access_token>@github.com/TusimaNetwork/tusima-airdrop-contracts.git
```

> how to get github access_token: [Github Docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

install the required dependencies inside the relevant folders:

```
yarn
```

Deploy **tusimaAirDrop** :

```
npx hardhat run scripts/deploy.js --network optimismGoerli
```

> if you wang to deploy in another network, add network config in hardhat.config.js



Run test script:

```
npx hardhat test test/airdrop.test.js
```



## Task

#### newRound

```
npx hardhat updateRound --start startTime --end endTime --network network
```

This task is used to start a new round within the set time.

#### updateRound

````
npx hardhat updateRound --start startTime --end endTime --network network
````

This task is used to update the start and end time of the current round.

#### update

```
npx hardhat update --path excelFilePath --sheet sheetNum --network network
```

This task is used for 

-  Convert the data in excel to json file 
- Upload the generated json file to github 
- Update the MerkleRoot of the contract

