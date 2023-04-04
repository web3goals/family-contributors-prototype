import { useRouter } from "next/router";
import AccountContributionTabs from "~~/components/account/AccountContributionTabs";
import AccountProfile from "~~/components/account/AccountProfile";
import Layout from "~~/components/layout";
import { CentralizedBox } from "~~/components/styled";

/**
 * Page with an account.
 */
export default function Account() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Layout>
      {slug && (
        <CentralizedBox>
          <AccountProfile address={slug as string} />
          <AccountContributionTabs address={slug as string} sx={{ mt: 6 }} />
        </CentralizedBox>
      )}
    </Layout>
  );
}
