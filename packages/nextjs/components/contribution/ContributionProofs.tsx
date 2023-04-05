import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { CardBox, FullWidthSkeleton, LLoadingButton, XlLoadingButton } from "../styled";
import ContributionPostProofDialog from "./ContributionPostProofDialog";
import { Avatar, Box, Link as MuiLink, Stack, SxProps, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { BigNumber } from "ethers";
import { useAccount, useWaitForTransaction } from "wagmi";
import { DialogContext } from "~~/context/dialog";
import ProofUriDataEntity from "~~/entities/uri/ProofUriDataEntity";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import useError from "~~/hooks/useError";
import useIpfs from "~~/hooks/useIpfs";
import useToasts from "~~/hooks/useToast";
import { emojiAvatarForAddress } from "~~/utils/avatars";
import { addressToShortAddress, bigNumberTimestampToLocaleDateString, ipfsUriToHttpUri } from "~~/utils/converters";

/**
 * A component with contribution proofs.
 */
export default function ContributionProofs(props: {
  id: string;
  authorAddress: string;
  isClosed: boolean;
  onUpdate: () => void;
  sx?: SxProps;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  // Contract states
  const { data: proofs, refetch: refetchProofs } = useScaffoldContractRead({
    contractName: "Contribution",
    functionName: "getProofs",
    args: [BigNumber.from(props.id)],
  });

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* Title */}
      <Typography variant="h4" fontWeight={700} textAlign="center">
        👀 Proofs of contribution
      </Typography>
      {/* Button to add proof */}
      <Box display="flex" flexDirection="column" alignItems="center" mt={3} mb={3}>
        <XlLoadingButton
          variant="contained"
          onClick={() =>
            showDialog?.(
              <ContributionPostProofDialog
                id={props.id}
                onSuccess={() => {
                  refetchProofs();
                }}
                onClose={closeDialog}
              />,
            )
          }
        >
          Post Proof
        </XlLoadingButton>
      </Box>
      {/* List with proofs */}
      {proofs && proofs.length > 0 && (
        <Stack spacing={2}>
          {[...proofs].reverse().map((proof, index) => (
            <ContributionProofCard
              key={index}
              authorAddress={proof.authorAddress}
              postedTimestamp={proof.postedTimestamp}
              extraDataURI={proof.extraDataURI}
              contributionId={props.id}
              contributionAuthorAddress={props.authorAddress}
              isContributionClosed={props.isClosed}
              onUpdate={() => {
                refetchProofs();
                props.onUpdate();
              }}
            />
          ))}
        </Stack>
      )}
      {/* Empty list */}
      {proofs && proofs.length === 0 && (
        <CardBox>
          <Typography textAlign="center">😐 no proofs</Typography>
        </CardBox>
      )}
      {/* Loading list */}
      {!proofs && <FullWidthSkeleton />}
    </Box>
  );
}

function ContributionProofCard(props: {
  authorAddress: string;
  postedTimestamp: BigNumber;
  extraDataURI: string;
  contributionId: string;
  contributionAuthorAddress: string;
  isContributionClosed: boolean;
  onUpdate: () => void;
  sx?: SxProps;
}) {
  const { handleError } = useError();
  const { address } = useAccount();
  const { loadJsonFromIpfs } = useIpfs();
  const [proofData, setProofData] = useState<ProofUriDataEntity | undefined>();

  useEffect(() => {
    if (props.extraDataURI) {
      loadJsonFromIpfs(props.extraDataURI)
        .then(result => setProofData(result))
        .catch(error => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.extraDataURI]);

  return (
    <CardBox
      sx={{
        display: "flex",
        flexDirection: "row",
        ...props.sx,
      }}
    >
      {/* Left part */}
      <Box>
        {/* Avatar */}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            borderRadius: 36,
            background: emojiAvatarForAddress(props.authorAddress).color,
          }}
        >
          <Typography>{emojiAvatarForAddress(props.authorAddress).emoji}</Typography>
        </Avatar>
      </Box>
      {/* Right part */}
      <Box width={1} ml={1.5}>
        {/* Account */}
        <Stack direction="row" spacing={1} alignItems="center">
          <MuiLink
            href={`/accounts/${props.authorAddress}`}
            // color={cardParams.isBackgroundDark ? theme.palette.primary.contrastText : theme.palette.primary.main}
            fontWeight={700}
            variant="body2"
          >
            {addressToShortAddress(props.authorAddress)}
          </MuiLink>
          {address?.toLowerCase() === props.authorAddress.toLowerCase() && (
            <Typography color={grey[600]} fontWeight={700} variant="body2">
              (you)
            </Typography>
          )}
        </Stack>
        {/* Date */}
        <Typography color={grey[600]} variant="body2">
          {bigNumberTimestampToLocaleDateString(props.postedTimestamp)}
        </Typography>
        {proofData ? (
          <>
            {/* Description */}
            <Typography fontWeight={700} mt={1}>
              {proofData.description}
            </Typography>
            {/* Content */}
            {proofData.type === "IMAGE" ? (
              <Box mt={1}>
                <Image
                  src={ipfsUriToHttpUri(proofData.uri || "")}
                  alt="Proof image"
                  width="100"
                  height="100"
                  sizes="100vw"
                  style={{ borderRadius: "18px", width: "100%", height: "auto" }}
                />
              </Box>
            ) : (
              <Stack>
                <MuiLink href={ipfsUriToHttpUri(proofData.uri || "")} target="_blank" mt={1}>
                  Link #1 (HTTP)
                </MuiLink>
                <MuiLink href={proofData.uri || ""} target="_blank" mt={1}>
                  Link #2 (IPFS)
                </MuiLink>
              </Stack>
            )}
          </>
        ) : (
          <Typography color={grey[600]} variant="body2" mt={1}>
            Loading...
          </Typography>
        )}
        {/* Button to confirm */}
        {!props.isContributionClosed && address === props.contributionAuthorAddress && (
          <ContributionProofConfirmButton
            id={props.contributionId}
            confirmedContributor={props.authorAddress}
            onSuccess={props.onUpdate}
            sx={{ mt: 2 }}
          />
        )}
      </Box>
    </CardBox>
  );
}

function ContributionProofConfirmButton(props: {
  id: string;
  confirmedContributor: string;
  onSuccess: () => void;
  sx?: SxProps;
}) {
  const { showToastSuccess } = useToasts();

  const {
    writeAsync: contractWriteAsync,
    isLoading: isContractLoading,
    data: contractData,
  } = useScaffoldContractWrite({
    contractName: "Contribution",
    functionName: "confirmContributor",
    args: [BigNumber.from(props.id), props.confirmedContributor],
  });

  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransaction({
    hash: contractData?.hash,
  });

  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Contribution is confirmed");
      props.onSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransactionSuccess]);

  return (
    <LLoadingButton
      variant="outlined"
      loading={isContractLoading}
      disabled={isContractLoading || isTransactionLoading || isTransactionSuccess}
      onClick={() => contractWriteAsync?.()}
      sx={{ ...props.sx }}
    >
      Confirm
    </LLoadingButton>
  );
}
