const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { expect } = require("chai");
const { Web3 } = require("web3");
const fs = require("fs");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { time } = require('@nomicfoundation/hardhat-network-helpers');
//const tokenInfo = require("../airDrop.json");

describe("OPDrop", function () {
  let deployments;
  let deployer, receiver, addr1;

  before(async function () {
    [deployer, receiver, addr1, addr2, addr3] = await ethers.getSigners();
    const deployment = require("../scripts/deploy.exe.js");

    deployments = await deployment.execute();
  });

  const web3 = new Web3("http://localhost:8545");

  function hashToken(account, amount) {
    const weiValues = ethers.utils.parseUnits(amount.toString(), "ether");
    return Buffer.from(
      ethers.utils
        .solidityKeccak256(
          ["address", "uint256"],
          [account, weiValues]
        )
        .slice(2),
      "hex"
    );
  }

  function webHashToken(account, amount) {
    const weiValues = ethers.utils.parseUnits(amount.toString(), "ether");
    return web3.utils.soliditySha3(
      { t: "address", v: account },
      { t: "uint256", v: weiValues }
    );
  }

  describe("merkleTree proof", async function () {

    it("should mint token successfully", async function () {
      await deployments.origamiGovernanceToken.enableTransfer();
      const billionEther = ethers.utils.parseUnits("100000000", "ether");
      await deployments.origamiGovernanceToken.mint(
        await deployments.tusimaAirDrop.address,
        billionEther
      );

      expect(
        await deployments.origamiGovernanceToken.balanceOf(deployments.tusimaAirDrop.address)
      ).to.equal(billionEther);
    });

    it("should update dropContract successfully", async function () {
      const timestamp = await time.latest();
      await deployments.tusimaAirDrop.updateRound(timestamp,timestamp+86400);
      await deployments.tusimaAirDrop.setTokenAddr(deployments.origamiGovernanceToken.address);
    })

    // it("should build merkleTree successfully", async function () {
      // this.leafs = tokenInfo.map((token) =>
      //   webHashToken(token.account, token.amount)
      // );
      // this.merkletree = new MerkleTree(this.leafs, keccak256, {
      //   sortPairs: true,
      // });

      // console.log("\nMerkleTree:");
      // console.log(this.merkletree.toString());
    // });

    // it("should get merkletree root successfully", async function () {
    //   this.root = this.merkletree.getHexRoot();
    //   console.log("\nRoot:");
    //   console.log(this.root);

    //   //change root
    //   await deployments.tusimaAirDrop.updateMerkleRoot(this.root);
    // });

    // it("should get merkletree proof successfully", async function () {
    //   console.log("\nHashToken:", this.leafs[4]);

    //   const testLeaf = webHashToken(
    //     "0x8e0c1d7261230adDdF88Ced8bb7E569eBC20510c",
    //     53.2
    //   );

    //   console.log("amount:", ethers.utils.parseUnits("53.2", "ether"));

    //   console.log("proof:", this.merkletree.getHexProof(testLeaf));


    //   this.proof = this.merkletree.getHexProof(this.leafs[4]);
    //   console.log("\nProof:");
    //   console.log(this.proof);
    // });

    it("should claim successfully", async function () {
      // const dropValue = ethers.utils.parseUnits(
      //   tokenInfo[4].amount.toString(),
      //   "ether"
      // );
      // await deployments.tusimaAirDrop
      //   .connect(addr3)
      //   .getDrop(this.proof, dropValue, tokenInfo[4].round);
      // expect(await deployments.tsm.balanceOf(addr3.address)).to.equal(
      //   dropValue
      // );
      const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("./airDrop.json")));
      await deployments.tusimaAirDrop.updateMerkleRoot(tree.root);

      //get proof
      var deployerProof;
      for (const [i, v] of tree.entries()) {
        if (v[0] === deployer.address) {
          deployerProof = tree.getProof(i);
        }
      }

      await deployments.tusimaAirDrop.claim(deployerProof, "50000000000000000000");
      expect(await deployments.tusimaAirDrop.claimed(deployer.address,0)).to.equal(true);
    });

    it("should print five local address", async function () {
      for (let index = 0; index < 15; index++) {
        var indexAddress = await ethers.getSigners();
        console.log(indexAddress[index].address);
      }
    });
  });
});
