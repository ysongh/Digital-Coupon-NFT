require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    // npx hardhat run scripts/deploy.js --network skaletest
    skaletest: {
      url: "https://eth-online.skalenodes.com/v1/hackathon-complex-easy-naos",
      accounts: [process.env.PRIVATEKEY],
      chainId: 647426021,
      gasPrice: 8000000000
    },
    // npx hardhat run scripts/deploy.js --network auroratest
    auroratest: {
      url: "https://testnet.aurora.dev/",
      accounts: [process.env.PRIVATEKEY],
      chainId: 1313161555,
      gasPrice: 8000000000
    }
  },
};
