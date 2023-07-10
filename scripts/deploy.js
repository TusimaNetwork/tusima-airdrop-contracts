// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const deployment = require("./deploy.exe");
  const deployments = ({ 
    token, 
    tusimaAirdrop 
  } = await deployment.execute());

  console.log(`****** MockToken ******`);
  console.log("MockTokenAddress:", token.address);


  console.log(`****** TusimaAirdrop ******`);
  console.log("proxyAddress:", tusimaAirdrop.address);
  console.log("waiting two comfirm ... ");
  const receipt = await tusimaAirdrop.deployTransaction.wait(2);

  console.log(
    "implementationAddress",
    await upgrades.erc1967.getImplementationAddress(tusimaAirdrop.address)
  );


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
