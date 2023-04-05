export default interface ContributionEntity {
  readonly id: string;
  readonly publishedTimestamp: string;
  readonly authorAddress: string;
  readonly description: string;
  readonly reward: string;
  readonly potentialContributors: Array<string>;
  readonly confirmedContributor: string;
  readonly isClosed: boolean;
}
