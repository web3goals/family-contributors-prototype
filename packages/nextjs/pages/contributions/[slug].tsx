import { useRouter } from "next/router";
import ContributionParams from "~~/components/contribution/ContributionParams";
import ContributionProofs from "~~/components/contribution/ContributionProofs";
import Layout from "~~/components/layout";
import { CentralizedBox, ThickDivider } from "~~/components/styled";

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
          <ThickDivider sx={{ mt: 8 }} />
          <ContributionProofs id={slug as string} sx={{ mt: 8 }} />
        </CentralizedBox>
      )}
    </Layout>
  );
}
