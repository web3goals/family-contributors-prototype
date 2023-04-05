import { useEffect, useState } from "react";
import { CardBox, FullWidthSkeleton, XxlLoadingButton } from "../styled";
import { Avatar, Box, Link as MuiLink, Stack, SxProps, Typography } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import ContributionEntity from "~~/entities/subgraph/ContributionEntity";
import useError from "~~/hooks/useError";
import useSubgraph from "~~/hooks/useSubgraph";
import { emojiAvatarForAddress } from "~~/utils/avatars";
import { addressToShortAddress } from "~~/utils/converters";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

/**
 * A component with contribution list.
 */
export default function ContributionList(props: {
  authorAddress?: string;
  potentialContributor?: string;
  sx?: SxProps;
}) {
  const { handleError } = useError();
  const { findContributions } = useSubgraph();
  const [contributions, setContributions] = useState<Array<ContributionEntity> | undefined>();
  const [isMoreContributionsExist, setIsMoreContributionsExist] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 3;

  async function loadMoreContributions(pageNumber: number) {
    try {
      const loadedContributions = await findContributions({
        authorAddress: props.authorAddress,
        potentialContributor: props.potentialContributor,
        first: pageSize,
        skip: pageNumber * pageSize,
      });
      setContributions(contributions ? [...contributions, ...loadedContributions] : loadedContributions);
      setPageNumber(pageNumber);
      if (loadedContributions.length === 0) {
        setIsMoreContributionsExist(false);
      }
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    setContributions(undefined);
    setIsMoreContributionsExist(true);
    loadMoreContributions(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* List with contributions */}
      {contributions && contributions.length > 0 && (
        <Stack spacing={2}>
          {contributions.map((contribution, index) => (
            <ContributionCard key={index} contribution={contribution} />
          ))}
          {/* Actions */}
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            {isMoreContributionsExist && (
              <XxlLoadingButton
                variant="outlined"
                onClick={() => {
                  loadMoreContributions(pageNumber + 1);
                }}
              >
                Load More
              </XxlLoadingButton>
            )}
          </Stack>
        </Stack>
      )}
      {/* Empty list */}
      {contributions && contributions.length === 0 && (
        <CardBox>
          <Typography textAlign="center">😐 no contributions</Typography>
        </CardBox>
      )}
      {/* Loading list */}
      {!contributions && <FullWidthSkeleton />}
    </Box>
  );
}

function ContributionCard(props: { contribution: ContributionEntity; sx?: SxProps }) {
  return (
    <CardBox sx={{ ...props.sx }}>
      {/* Link */}
      <MuiLink href={`/contributions/${props.contribution.id}`} fontWeight={700}>
        🍭 Asking for contribution #{props.contribution.id}
      </MuiLink>
      {/* Description */}
      <Typography variant="h6" fontWeight={700} mt={1}>
        {props.contribution.description}
      </Typography>
      {/* Author, reward */}
      <Stack direction="row" spacing={2} mt={1.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{
              width: 22,
              height: 22,
              borderRadius: 22,
              background: emojiAvatarForAddress(props.contribution.authorAddress).color,
            }}
          >
            <Typography variant="body2">{emojiAvatarForAddress(props.contribution.authorAddress).emoji}</Typography>
          </Avatar>
          <MuiLink href={`/accounts/${props.contribution.authorAddress}`} variant="body2" fontWeight={700}>
            {addressToShortAddress(props.contribution.authorAddress)}
          </MuiLink>
        </Stack>
        <Typography variant="body2" fontWeight={700} mt={1}>
          💰 {ethers.utils.formatEther(BigNumber.from(props.contribution.reward))}{" "}
          {getTargetNetwork().nativeCurrency.name}
        </Typography>
      </Stack>
    </CardBox>
  );
}
