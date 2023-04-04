import { useContext } from "react";
import {
  FullWidthSkeleton,
  WidgetBox,
  WidgetLink,
  WidgetSeparatorText,
  WidgetText,
  WidgetTitle,
  XlLoadingButton,
} from "../styled";
import ContributionShareDialog from "./ContributionShareDialog";
import { Box, Stack, SxProps, Typography } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { DialogContext } from "~~/context/dialog";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { palette } from "~~/theme/palette";
import { addressToShortAddress } from "~~/utils/converters";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

/**
 * A component with contribution parameters.
 */
export default function ContributionParams(props: { id: string; sx?: SxProps }) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  // Contract states
  const { data: contractData } = useScaffoldContractRead({
    contractName: "Contribution",
    functionName: "getParams",
    args: [BigNumber.from(props.id)],
  });

  if (!contractData) {
    return <FullWidthSkeleton />;
  }

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* Id */}
      <Typography variant="h4" fontWeight={700} textAlign="center">
        🍭 Asking for contribution # {props.id}
      </Typography>
      <WidgetSeparatorText mt={2}>was published</WidgetSeparatorText>
      {/* Author address */}
      <WidgetBox bgcolor={palette.blue} mt={2}>
        <WidgetTitle>By</WidgetTitle>
        <WidgetLink href={`/accounts/${contractData.authorAddress.toString()}`}>
          {addressToShortAddress(contractData.authorAddress.toString())}
        </WidgetLink>
      </WidgetBox>
      <WidgetSeparatorText mt={2}>with</WidgetSeparatorText>
      {/* Description */}
      <WidgetBox bgcolor={palette.purpleLight} mt={2}>
        <WidgetTitle>Description</WidgetTitle>
        <WidgetText>{contractData.description}</WidgetText>
      </WidgetBox>
      <WidgetSeparatorText mt={2}>for</WidgetSeparatorText>
      {/* Potential contributors */}
      <WidgetBox bgcolor={palette.purpleDark} mt={2}>
        <WidgetTitle>Account #1</WidgetTitle>
        <WidgetLink href={`/accounts/${contractData.potentialContributors[0].toString()}`}>
          {addressToShortAddress(contractData.potentialContributors[0].toString())}
        </WidgetLink>
      </WidgetBox>
      <WidgetBox bgcolor={palette.purpleDark} mt={2}>
        <WidgetTitle>Account #2</WidgetTitle>
        <WidgetLink href={`/accounts/${contractData.potentialContributors[1].toString()}`}>
          {addressToShortAddress(contractData.potentialContributors[1].toString())}
        </WidgetLink>
      </WidgetBox>
      <WidgetBox bgcolor={palette.purpleDark} mt={2}>
        <WidgetTitle>Account #3</WidgetTitle>
        <WidgetLink href={`/accounts/${contractData.potentialContributors[2].toString()}`}>
          {addressToShortAddress(contractData.potentialContributors[2].toString())}
        </WidgetLink>
      </WidgetBox>
      <WidgetSeparatorText mt={2}>and</WidgetSeparatorText>
      {/* Reward */}
      <WidgetBox bgcolor={palette.green} mt={2}>
        <WidgetTitle>Reward</WidgetTitle>
        <Stack direction="row" spacing={1}>
          <WidgetText>{ethers.utils.formatEther(contractData.reward)}</WidgetText>
          <WidgetText>{getTargetNetwork().nativeCurrency?.symbol}</WidgetText>
        </Stack>
      </WidgetBox>
      <WidgetSeparatorText mt={2}>
        which will be sent to the first account that makes this contribution and provides proof
      </WidgetSeparatorText>
      {/* TODO: Display confirmed contributor is contribution is closed */}
      {/* Share button */}
      <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
        <XlLoadingButton
          variant="outlined"
          onClick={() => showDialog?.(<ContributionShareDialog id={props.id} onClose={closeDialog} />)}
        >
          Share
        </XlLoadingButton>
      </Box>
    </Box>
  );
}
