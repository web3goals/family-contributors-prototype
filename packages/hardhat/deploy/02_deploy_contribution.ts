import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployContribution: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Contribution", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const contract = await hre.ethers.getContract("Contribution", deployer);
  console.log("✅ Contract deployed to " + contract.address);

  await contract.initialize();
  console.log("👌 Contract initialized");
};

export default deployContribution;

deployContribution.tags = ["Contribution"];
