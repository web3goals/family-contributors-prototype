import { Published, Transfer } from "../../generated/Contribution/Contribution";
import { Contribution } from "../../generated/schema";
import { addressesToStrings, loadOrCreateContribution } from "../utils";

export function handleTransfer(event: Transfer): void {
  let contribution = loadOrCreateContribution(event.params.tokenId.toString());
  contribution.save();
}

export function handlePublished(event: Published): void {
  let contribution = Contribution.load(event.params.tokenId.toString());
  if (!contribution) {
    return;
  }
  contribution.publishedTimestamp = event.params.params.publishedTimestamp;
  contribution.authorAddress = event.params.params.authorAddress.toHexString();
  contribution.description = event.params.params.description;
  contribution.reward = event.params.params.reward;
  contribution.potentialContributors = addressesToStrings(
    event.params.params.potentialContributors
  );
  contribution.confirmedContributor = event.params.params.confirmedContributor.toHexString();
  contribution.isClosed = event.params.params.isClosed;
  contribution.save();
}
