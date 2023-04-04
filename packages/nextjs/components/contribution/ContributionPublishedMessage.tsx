import { CentralizedBox, ThickDivider } from "../styled";
import ContributionShareActions from "./ContributionShareActions";
import { Typography } from "@mui/material";

/**
 * A component with message that contribution is posted.
 */
export default function ContributionPublishedMessage(props: { id: string }) {
  return (
    <CentralizedBox>
      <Typography variant="h4" textAlign="center" fontWeight={700}>
        🤟 Congrats, your asking for contribution is published!
      </Typography>
      <ThickDivider sx={{ mt: 5 }} />
      <ContributionShareActions id={props.id} sx={{ mt: 6 }} />
    </CentralizedBox>
  );
}
