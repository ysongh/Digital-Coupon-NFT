// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const worldIDAddress = "0xABB70f7F39035586Da57B3c8136035f87AC0d2Aa";
  const actionID = "";
  const DigitalCoupon = await hre.ethers.getContractFactory("DigitalCoupon");
  const digitalCoupon = await DigitalCoupon.deploy(worldIDAddress, actionID);

  await digitalCoupon.deployed();

  console.log(
    `DigitalCoupon deployed to ${digitalCoupon.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
