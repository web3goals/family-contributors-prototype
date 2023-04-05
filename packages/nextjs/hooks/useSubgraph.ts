import axios from "axios";
import * as chains from "wagmi/chains";
import ContributionEntity from "~~/entities/subgraph/ContributionEntity";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

/**
 * Hook to work with subgraph.
 */
export default function useSubgraph() {
  const defaultFirst = 10;
  const defaultSkip = 0;

  const findContributions = async function (args: {
    authorAddress?: string;
    potentialContributor?: string;
    first?: number;
    skip?: number;
  }): Promise<Array<ContributionEntity>> {
    // Prepare query
    const authorAddressFilter = args.authorAddress ? `authorAddress: "${args.authorAddress.toLowerCase()}"` : "";
    const potentialContributorFilter = args.potentialContributor
      ? `potentialContributors_contains: ["${args.potentialContributor.toLowerCase()}"]`
      : "";
    const filterParams = `where: {${authorAddressFilter}, ${potentialContributorFilter}}`;
    const sortParams = `orderBy: publishedTimestamp, orderDirection: desc`;
    const paginationParams = `first: ${args.first || defaultFirst}, skip: ${args.skip || defaultSkip}`;
    const query = `{
      contributions(${filterParams}, ${sortParams}, ${paginationParams}) {
        id
        publishedTimestamp
        authorAddress
        description
        reward
        potentialContributors
        confirmedContributor
        isClosed
      }
    }`;
    // Make query and return result
    const response = await makeSubgraphQuery(query);
    const contributions: Array<ContributionEntity> = [];
    response.contributions?.forEach((contribution: any) => {
      contributions.push({
        id: contribution.id,
        publishedTimestamp: contribution.publishedTimestamp,
        authorAddress: contribution.authorAddress,
        description: contribution.description,
        reward: contribution.reward,
        potentialContributors: contribution.potentialContributors,
        confirmedContributor: contribution.confirmedContributor,
        isClosed: contribution.isClosed,
      });
    });
    return contributions;
  };

  return {
    findContributions,
  };
}

async function makeSubgraphQuery(query: string) {
  try {
    let chainSubgraphApiUrl;
    if (getTargetNetwork().id === chains.polygonMumbai.id) {
      chainSubgraphApiUrl = process.env.NEXT_PUBLIC_SUBGRAPH_MUMBAI_API_URL;
    }
    if (!chainSubgraphApiUrl) {
      throw new Error(`Chain '${getTargetNetwork().name}' does not support a subgraph`);
    }
    const response = await axios.post(chainSubgraphApiUrl, {
      query: query,
    });
    if (response.data.errors) {
      throw new Error(JSON.stringify(response.data.errors));
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(`Could not query the subgraph: ${JSON.stringify(error.message)}`);
  }
}
