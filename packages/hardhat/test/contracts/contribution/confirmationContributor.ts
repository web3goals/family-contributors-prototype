import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import {
  contributionContract,
  contributionParams,
  makeSuiteCleanRoom,
  userFourAddress,
  userOne,
  userThreeAddress,
  userTwoAddress,
} from "../../setup";

makeSuiteCleanRoom("Contribution Confirmation Contributor", function () {
  let contribution: BigNumber;

  beforeEach(async function () {
    // Publish contribution
    await contributionContract
      .connect(userOne)
      .publish(
        contributionParams.one.description,
        contributionParams.one.reward,
        [userTwoAddress, userThreeAddress, userFourAddress],
        {
          value: contributionParams.one.reward,
        },
      );
    contribution = await contributionContract.connect(userOne).getCurrentCounter();
  });

  it("Contribution author should be able to confirm contributor", async function () {
    // Confirm contributor
    await expect(
      contributionContract.connect(userOne).confirmContributor(contribution, userThreeAddress),
    ).to.changeEtherBalances(
      [userThreeAddress, contributionContract.address],
      [contributionParams.one.reward, contributionParams.one.reward.mul(ethers.constants.NegativeOne)],
    );
    // Check contribution params
    const params = await contributionContract.getParams(contribution);
    expect(params.confirmedContributor).to.equal(userThreeAddress);
    expect(params.isClosed).to.equal(true);
    // Check reputation
    const reputation = await contributionContract.getAccountReputation(userThreeAddress);
    expect(reputation.confirmedContributions).to.equal(1);
  });
});
