import { useRouter } from "next/router";
import ContributionParams from "~~/components/contribution/ContributionParams";
import Layout from "~~/components/layout";
import { CentralizedBox } from "~~/components/styled";

/**
 * Page with a contribution.
 */
export default function Contribution() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Layout maxWidth="sm">
      {slug && (
        <CentralizedBox>
          <ContributionParams id={slug as string} />
          {/* TODO: Add contribution proofs */}
        </CentralizedBox>
      )}
    </Layout>
  );
}
