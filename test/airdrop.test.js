const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { expect } = require("chai");
const { BigNumber } = require("@ethersproject/bignumber");
const tokenInfo = require("./tokens.json");

describe("ArbDrop", function () {
  let deployments;
  let deployer, receiver, addr1;

  before(async function () {
    [deployer, receiver, addr1] = await ethers.getSigners();
    const deployment = require("../scripts/deployArbDrop.js");

    deployments = await deployment.execute();
  });

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
      this.merkletree = new MerkleTree(
        tokenInfo.map((token) =>
          hashToken(token.account, token.amount, token.round)
        ),
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
     });

    it("should get merkletree proof successfully", async function () {
      leafZero = hashToken(
        tokenInfo[0].account,
        tokenInfo[0].amount,
        tokenInfo[0].round
      );
      this.proof = this.merkletree.getHexProof(leafZero);
      console.log("\nProof:");
      console.log(this.proof);
    });

    it("should claim successfully", async function () {
      const dropValue = ethers.utils.parseUnits("1001.1", "ether");
      await deployments.arbDrop.getDrop(this.proof, dropValue, 1);
      expect(await deployments.tsm.balanceOf(deployer.address)).to.equal(
        dropValue
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
