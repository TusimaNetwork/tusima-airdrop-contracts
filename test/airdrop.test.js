const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { expect } = require("chai");
const { Web3 } = require("web3");
const { BigNumber } = require("@ethersproject/bignumber");
const tokenInfo = require("./tokens.json");

describe("ArbDrop", function () {
  let deployments;
  let deployer, receiver, addr1;

  before(async function () {
    [deployer, receiver, addr1,addr2,addr3] = await ethers.getSigners();
    const deployment = require("../scripts/deployArbDrop.js");

    deployments = await deployment.execute();
  });

  const web3 = new Web3("http://localhost:8545");

  function hashToken(account,amount,round) {
    const weiValues = ethers.utils.parseUnits(amount.toString(), "ether");
    return Buffer.from(
      ethers.utils
        .solidityKeccak256(
          ["address", "uint256", "uint8"],
          [account, weiValues, round]
        )
        .slice(2),
      "hex"
    );
  }

  function webHashToken(account,amount,round) {
    const weiValues = ethers.utils.parseUnits(amount.toString(), "ether");
    return web3.utils.soliditySha3(
      { t: "address", v: account },
      { t: "uint256", v: weiValues },
      { t: "uint8", v: round }
    );
  }

  describe("merkleTree proof", async function () {
     it("should mint token successfully", async function () {
      const billionEther = ethers.utils.parseUnits("100000000", "ether");
        await deployments.tsm.mint(
          await deployments.arbDrop.address,
          billionEther
        );

      expect(
        await deployments.tsm.balanceOf(deployments.arbDrop.address)
      ).to.equal(billionEther);
     })
    it("should build merkleTree successfully", async function () {
      this.leafs = tokenInfo.map((token) =>
        webHashToken(token.account, token.amount, token.round)
      );
      this.merkletree = new MerkleTree(
        this.leafs,
        keccak256,
        { sortPairs: true }
      );

      console.log("\nMerkleTree:");
      console.log(this.merkletree.toString());
    });

     it("should get merkletree root successfully", async function () {
       this.root = this.merkletree.getHexRoot();
       console.log("\nRoot:");
       console.log(this.root);

       //change root
       await deployments.arbDrop.changeRoot(this.root);
     });

    it("should get merkletree proof successfully", async function () {
      // leaf = hashToken(
      //   tokenInfo[4].account,
      //   tokenInfo[4].amount,
      //   tokenInfo[4].round
      // );
      console.log("\nHashToken:",this.leafs[4]);

      this.proof = this.merkletree.getHexProof(this.leafs[4]);
      console.log("\nProof:");
      console.log(this.proof);
    });

    it("should claim successfully", async function () {
      const dropValue = ethers.utils.parseUnits("1005.5", "ether");
      await deployments.arbDrop.connect(addr3).getDrop(this.proof, dropValue, 1);
      expect(await deployments.tsm.balanceOf(addr3.address)).to.equal(
        dropValue
      );
      expect(await deployments.arbDrop.claimed(this.leafs[4])).to.equal(
        true
      );
    });
    // it("should print ten address", async function () {
    //   for (let index = 0; index < 12; index++) {
    //     var indexAddress = await ethers.getSigners();
    //     console.log(indexAddress[index].address);
    //   }
    // });

  });
});
