const { ethers } = require("hardhat");
const { expect } = require("chai");
const { Web3 } = require("web3");
const fs = require("fs");
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const { time } = require('@nomicfoundation/hardhat-network-helpers');

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
    it("should not scucess without right time", async function () {
     
    });



    it("should mint token successfully", async function () {
      const billionEther = ethers.utils.parseUnits("100000000", "ether");
      await deployments.token.mint(
        await deployments.tusimaAirdrop.address,
        billionEther
      );

      expect(
        await deployments.token.balanceOf(deployments.tusimaAirdrop.address)
      ).to.equal(billionEther);
    });

    it("should update dropContract successfully", async function () {
      const timestamp = await time.latest();
      await deployments.tusimaAirdrop.updateRound(timestamp,timestamp+86400);
      await deployments.tusimaAirdrop.setTokenAddr(
        deployments.token.address
      );
    })

    it("should claim successfully", async function () {

      const tree = StandardMerkleTree.load(
        JSON.parse(fs.readFileSync("./tusima-airdrop-merkledata/airDrop.json"))
      );
      await deployments.tusimaAirdrop.updateMerkleRoot(tree.root);

      //get proof
      var deployerProof;
      for (const [i, v] of tree.entries()) {
        if (v[0] === deployer.address) {
          deployerProof = tree.getProof(i);
        }
      }

      await deployments.tusimaAirdrop.claim(deployerProof, "50000000000000000000");
      expect(await deployments.tusimaAirdrop.claimed(deployer.address,0)).to.equal(true);
    });

    it("should print five local address", async function () {
      for (let index = 0; index < 15; index++) {
        var indexAddress = await ethers.getSigners();
        console.log(indexAddress[index].address);
      }
    });

  });
});
