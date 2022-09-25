// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const worldIDAddress = "0xABB70f7F39035586Da57B3c8136035f87AC0d2Aa";
  const DigitalCoupon = await hre.ethers.getContractFactory("DigitalCoupon");
  const digitalCoupon = await DigitalCoupon.deploy(worldIDAddress);

  await digitalCoupon.deployed();

  console.log(
    `DigitalCoupon deployed to ${digitalCoupon.address}`
  );

  await digitalCoupon.createCoupon("https://dweb.link/ipfs/bafybeihcfd2bojowzxy6frpl54xqyt6cpk2wlp52avpetgj7yrcgx3m7ky", "7", "1000000000000000000", "10");
  console.log(`Coupon #1 is created`);
  await digitalCoupon.createCoupon("https://dweb.link/ipfs/bafybeigqj4in4bpiovytwo6ubsjc2myek6psciscszyozch3jlzs2hv3ra", "10", "1500000000000000000", "10");
  console.log(`Coupon #2 is created`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
