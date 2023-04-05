import { Typography } from "@mui/material";
import ContributionList from "~~/components/contribution/ContributionList";
import Layout from "~~/components/layout";
import { CentralizedBox } from "~~/components/styled";

/**
 * Page with contributions.
 */
export default function Contributions() {
  return (
    <Layout maxWidth="sm">
      <CentralizedBox>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          🍭 Last asks for contribution
        </Typography>
        <ContributionList sx={{ mt: 4 }} />
      </CentralizedBox>
    </Layout>
  );
}
