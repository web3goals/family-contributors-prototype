// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

library Errors {
  error TokenNotTransferable();
  error MessageValueMismatch();
  error RewardInvalid();
  error TokenDoesNotExist();
  error ContributionClosed();
  error NotPotentialContributor();
  error NotAuthor();
  error SendingRewardFailed();
}
