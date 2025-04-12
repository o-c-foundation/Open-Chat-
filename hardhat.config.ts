// https://eth-goerli.g.alchemy.com/v2/rAtfUcrWk0rx_lyWKqgdJa10XA9wQfry
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: process.env.API_KEY !== undefined ? [process.env.API_KEY] : [],
    },
    sepolia: {
      url: "https://rpc.sepolia.ethpandaops.io",
      accounts: [process.env.SEPOLIA_PRIVATE_KEY || "0x3cc2cb85a844ec870f18ac2e7abe25a2fcf8049138d15b27d593e578bbd8a934"]
    },
  },
  etherscan: {
    apiKey: {
      sepolia: "U1SWZQD51QW2UFW1YT8JE59GZAU55M3YEB"
    }
  }
};

export default config;
