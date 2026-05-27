const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const JobMarketplace = await hre.ethers.getContractFactory("JobMarketplace");
  const jobMarketplace = await JobMarketplace.deploy();

  await jobMarketplace.deployed();

  console.log("JobMarketplace deployed to:", jobMarketplace.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
