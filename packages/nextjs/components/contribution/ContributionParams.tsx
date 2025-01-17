import { useContext } from "react";
import { WidgetBox, WidgetLink, WidgetSeparatorText, WidgetText, WidgetTitle, XlLoadingButton } from "../styled";
import ContributionShareDialog from "./ContributionShareDialog";
import { Box, Stack, SxProps, Typography } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { DialogContext } from "~~/context/dialog";
import { palette } from "~~/theme/palette";
import { addressToShortAddress } from "~~/utils/converters";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

/**
 * A component with contribution parameters.
 */
export default function ContributionParams(props: {
  id: string;
  authorAddress: string;
  description: string;
  reward: BigNumber;
  potentialContributors: Array<string>;
  confirmedContributor: string;
  isClosed: boolean;
  sx?: SxProps;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);

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
        <WidgetLink href={`/accounts/${props.authorAddress.toString()}`}>
          {addressToShortAddress(props.authorAddress.toString())}
        </WidgetLink>
      </WidgetBox>
      <WidgetSeparatorText mt={2}>with</WidgetSeparatorText>
      {/* Description */}
      <WidgetBox bgcolor={palette.purpleLight} mt={2}>
        <WidgetTitle>Description</WidgetTitle>
        <WidgetText>{props.description}</WidgetText>
      </WidgetBox>
      {!props.isClosed && (
        <>
          <WidgetSeparatorText mt={2}>for</WidgetSeparatorText>
          {/* Potential contributors */}
          <WidgetBox bgcolor={palette.purpleDark} mt={2}>
            <WidgetTitle>Account #1</WidgetTitle>
            <WidgetLink href={`/accounts/${props.potentialContributors[0].toString()}`}>
              {addressToShortAddress(props.potentialContributors[0].toString())}
            </WidgetLink>
          </WidgetBox>
          <WidgetBox bgcolor={palette.purpleDark} mt={2}>
            <WidgetTitle>Account #2</WidgetTitle>
            <WidgetLink href={`/accounts/${props.potentialContributors[1].toString()}`}>
              {addressToShortAddress(props.potentialContributors[1].toString())}
            </WidgetLink>
          </WidgetBox>
          <WidgetBox bgcolor={palette.purpleDark} mt={2}>
            <WidgetTitle>Account #3</WidgetTitle>
            <WidgetLink href={`/accounts/${props.potentialContributors[2].toString()}`}>
              {addressToShortAddress(props.potentialContributors[2].toString())}
            </WidgetLink>
          </WidgetBox>
        </>
      )}
      <WidgetSeparatorText mt={2}>and</WidgetSeparatorText>
      {/* Reward */}
      <WidgetBox bgcolor={palette.green} mt={2}>
        <WidgetTitle>Reward</WidgetTitle>
        <Stack direction="row" spacing={1}>
          <WidgetText>{ethers.utils.formatEther(props.reward)}</WidgetText>
          <WidgetText>{getTargetNetwork().nativeCurrency?.symbol}</WidgetText>
        </Stack>
      </WidgetBox>
      {!props.isClosed ? (
        <WidgetSeparatorText mt={2}>
          which will be sent to the first account that makes this contribution and provides proof
        </WidgetSeparatorText>
      ) : (
        <>
          <WidgetSeparatorText mt={2}>which was sent to</WidgetSeparatorText>
          {/* Confirmed contributor */}
          <WidgetBox bgcolor={palette.red} mt={2}>
            <WidgetTitle>Contributor</WidgetTitle>
            <WidgetLink href={`/accounts/${props.confirmedContributor.toString()}`}>
              {addressToShortAddress(props.confirmedContributor.toString())}
            </WidgetLink>
          </WidgetBox>
        </>
      )}
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
