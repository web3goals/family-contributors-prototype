import {
  contributionContract,
  contributionParams,
  makeSuiteCleanRoom,
  userFourAddress,
  userOne,
  userOneAddress,
  userThreeAddress,
  userTwoAddress,
} from "../../setup";
import { expect } from "chai";
import { ethers } from "hardhat";

makeSuiteCleanRoom("Contribution Publishing", function () {
  it("User should be able to publish a contribution", async function () {
    // Publish contribution
    await expect(
      contributionContract
        .connect(userOne)
        .publish(
          contributionParams.one.description,
          contributionParams.one.reward,
          [userTwoAddress, userThreeAddress, userFourAddress],
          {
            value: contributionParams.one.reward,
          },
        ),
    ).to.changeEtherBalances(
      [userOne, contributionContract.address],
      [contributionParams.one.reward.mul(ethers.constants.NegativeOne), contributionParams.one.reward],
    );
    // Get contribution id
    const contributionId = await contributionContract.connect(userOne).getCurrentCounter();
    // Check contribution params
    const params = await contributionContract.getParams(contributionId);
    expect(params.description).to.equal(contributionParams.one.description);
    expect(params.authorAddress).to.equal(userOneAddress);
    expect(params.reward).to.equal(contributionParams.one.reward);
    expect(params.potentialContributors.length).to.equal(3);
    expect(params.isClosed).to.equal(false);
  });
});
