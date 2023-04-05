import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Contribution } from "../generated/schema";

export function loadOrCreateContribution(tokenId: string): Contribution {
  let contributionId = tokenId;
  let contribution = Contribution.load(contributionId);
  if (!contribution) {
    contribution = new Contribution(contributionId);
    contribution.publishedTimestamp = BigInt.zero();
    contribution.authorAddress = Address.zero().toHexString();
    contribution.description = "";
    contribution.reward = BigInt.zero();
    contribution.potentialContributors = new Array<string>();
    contribution.confirmedContributor = Address.zero().toHexString();
    contribution.isClosed = false;
  }
  return contribution;
}

export function addressesToStrings(addresses: Array<Address>): Array<string> {
  let strings = new Array<string>();
  for (let i = 0; i < addresses.length; i++) {
    strings.push(addresses[i].toHexString());
  }
  return strings;
}
