require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks: {
    // npx hardhat run scripts/deployV1.js --network skaletest
    skaletest: {
      url: "https://eth-online.skalenodes.com/v1/hackathon-complex-easy-naos",
      accounts: [process.env.PRIVATEKEY],
      chainId: 647426021,
      gasPrice: 8000000000
    },
    // npx hardhat run scripts/deployV1.js --network auroratest
    auroratest: {
      url: "https://testnet.aurora.dev/",
      accounts: [process.env.PRIVATEKEY],
      chainId: 1313161555,
      gasPrice: 8000000000
    },
    // npx hardhat run scripts/deployV1.js --network cronostest
    cronostest: {
      url: "https://evm-t3.cronos.org/",
      accounts: [process.env.PRIVATEKEY],
      chainId: 338,
      gasPrice: 8000000000
    },
    // npx hardhat run scripts/deploy.js --network mumbai
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [process.env.PRIVATEKEY],
      chainId: 80001,
      gasPrice: 8000000000
    },
    // npx hardhat run scripts/deployV1.js --network evmos
    evmos: {
      url: "https://eth.bd.evmos.dev:8545",
      accounts: [process.env.PRIVATEKEY],
      chainId: 9000,
      gasPrice: 8000000000
    },
    // npx hardhat run scripts/deployV1.js --network moonbase
    moonbase: {
      url: "https://rpc.api.moonbase.moonbeam.network",
      accounts: [process.env.PRIVATEKEY],
      chainId: 1287,
      gasPrice: 8000000000
    }
  },
};
