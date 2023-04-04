import { BigNumber } from "ethers";
import {
  contributionContract,
  contributionParams,
  contributionProofExtraDataUris,
  makeSuiteCleanRoom,
  userFourAddress,
  userOne,
  userThree,
  userThreeAddress,
  userTwo,
  userTwoAddress,
} from "../../setup";
import { expect } from "chai";

makeSuiteCleanRoom("Contribution Posting Proof", function () {
  let contribution: BigNumber;

  beforeEach(async function () {
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

  it("Potential contributor should be able to post proof", async function () {
    // Post proofs
    await expect(
      contributionContract.connect(userTwo).postProof(contribution, contributionProofExtraDataUris.two),
    ).to.be.not.reverted;
    await expect(
      contributionContract.connect(userThree).postProof(contribution, contributionProofExtraDataUris.three),
    ).to.be.not.reverted;
    // Check proofs
    const proofs = await contributionContract.getProofs(contribution);
    expect(proofs.length).to.be.equal(2);
  });
});
