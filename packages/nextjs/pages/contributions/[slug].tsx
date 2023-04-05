import { useRouter } from "next/router";
import { BigNumber } from "ethers";
import ContributionParams from "~~/components/contribution/ContributionParams";
import ContributionProofs from "~~/components/contribution/ContributionProofs";
import Layout from "~~/components/layout";
import { CentralizedBox, FullWidthSkeleton, ThickDivider } from "~~/components/styled";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

/**
 * Page with a contribution.
 */
export default function Contribution() {
  const router = useRouter();
  const { slug } = router.query;

  const { data: params, refetch: refetchParams } = useScaffoldContractRead({
    contractName: "Contribution",
    functionName: "getParams",
    args: slug ? [BigNumber.from(slug as string)] : [undefined],
  });

  return (
    <Layout maxWidth="sm">
      {params ? (
        <CentralizedBox>
          <ContributionParams
            id={slug as string}
            authorAddress={params.authorAddress}
            description={params.description}
            reward={params.reward}
            potentialContributors={params.potentialContributors as Array<string>}
            confirmedContributor={params.confirmedContributor}
            isClosed={params.isClosed}
          />
          <ThickDivider sx={{ mt: 8 }} />
          <ContributionProofs
            id={slug as string}
            authorAddress={params.authorAddress}
            isClosed={params.isClosed}
            onUpdate={() => refetchParams}
            sx={{ mt: 8 }}
          />
        </CentralizedBox>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}
