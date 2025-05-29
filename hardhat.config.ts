import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import * as dotenv from "dotenv";

dotenv.config();
console.log("RPC_URL:", process.env.RPC_URL);
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia:  {
      url: process.env.RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
    },
  },
  gasReporter:  {
    enabled: true,
    currency: "ETH",
  }
};

export default config;
