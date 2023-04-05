import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { CardBox, FullWidthSkeleton, XlLoadingButton } from "../styled";
import ContributionPostProofDialog from "./ContributionPostProofDialog";
import { Avatar, Box, Link as MuiLink, Stack, SxProps, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { DialogContext } from "~~/context/dialog";
import ProofUriDataEntity from "~~/entities/uri/ProofUriDataEntity";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import useError from "~~/hooks/useError";
import useIpfs from "~~/hooks/useIpfs";
import { emojiAvatarForAddress } from "~~/utils/avatars";
import { addressToShortAddress, bigNumberTimestampToLocaleDateString, ipfsUriToHttpUri } from "~~/utils/converters";

/**
 * A component with contribution proofs.
 */
export default function ContributionProofs(props: { id: string; sx?: SxProps }) {
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
          {proofs.map((proof, index) => (
            <ContributionProofCard
              key={index}
              authorAddress={proof.authorAddress}
              postedTimestamp={proof.postedTimestamp}
              extraDataURI={proof.extraDataURI}
              onUpdate={() => {
                // TODO: Update contribution params
                // TODO: Update proofs
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
  onUpdate: () => void;
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
        {/* TODO: Display for contribution author is contribution is not closed */}
      </Box>
    </CardBox>
  );
}
