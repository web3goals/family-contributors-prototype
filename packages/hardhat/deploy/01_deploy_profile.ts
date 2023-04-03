import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployProfile: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("Profile", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const contract = await hre.ethers.getContract("Profile", deployer);
  console.log("✅ Contract deployed to " + contract.address);

  await contract.initialize();
  console.log("👌 Contract initialized");
};

export default deployProfile;

deployProfile.tags = ["Profile"];
