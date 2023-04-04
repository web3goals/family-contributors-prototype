// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

library DataTypes {
  struct ContributionParams {
    uint publishedTimestamp;
    address authorAddress;
    string description;
    uint reward;
    address[] potentialContributors;
    address confirmedContributor;
    bool isClosed;
  }

  struct ContributionProof {
    uint postedTimestamp;
    address authorAddress;
    string extraDataURI;
  }

  struct ContributionAccountReputation {
    uint confirmedContributions;
  }
}
