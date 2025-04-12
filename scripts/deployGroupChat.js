// This script deploys the OpenChatGroups contract to Sepolia testnet
// Run with: npx hardhat run scripts/deployGroupChat.js --network sepolia

const hre = require("hardhat");

async function main() {
  console.log("Deploying OpenChatGroups contract to Sepolia testnet...");

  // Get the contract factory
  const OpenChatGroups = await hre.ethers.getContractFactory("OpenChatGroups");

  // Deploy the contract
  const groupChat = await OpenChatGroups.deploy();

  // Wait for the contract to be deployed
  await groupChat.deployed();

  console.log(`OpenChatGroups deployed to: ${groupChat.address}`);
  console.log("Update the sepoliaGroupChatContract address in lib/constants.ts with this address");
  
  console.log("\nVerification command:");
  console.log(`npx hardhat verify --network sepolia ${groupChat.address}`);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 