import Link from "next/link";
import { Telegram, Twitter } from "@mui/icons-material";
import { Box, IconButton, Link as MuiLink, SxProps, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { XlLoadingButton } from "~~/components/styled";
import useToasts from "~~/hooks/useToast";

/**
 * A component with buttons to share a contribution.
 */
export default function ContributionShareActions(props: { id: string; text?: string; sx?: SxProps }) {
  const { showToastSuccess } = useToasts();
  const contributionLink = `${global.window.location.origin}/contributions/${props.id}`;
  const twitterLink = `https://twitter.com/intent/tweet?url=${contributionLink}`;
  const telegramLink = `https://t.me/share/url?url=${contributionLink}`;

  if (contributionLink) {
    return (
      <Box
        sx={{
          width: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...props.sx,
        }}
      >
        <Typography variant="h6" textAlign="center">
          {props.text || "🗣️ Share the link with your family"}
        </Typography>
        {/* Buttons to share via social networks */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <IconButton href={twitterLink} target="_blank" color="primary" sx={{ border: 4, p: 3 }}>
            <Twitter sx={{ fontSize: 36 }} />
          </IconButton>
          <IconButton href={telegramLink} target="_blank" color="primary" sx={{ border: 4, p: 3 }}>
            <Telegram sx={{ fontSize: 36 }} />
          </IconButton>
        </Stack>
        {/* Link and copy button */}
        <Box
          sx={{
            width: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            border: 3,
            borderColor: "divider",
            borderRadius: 5,
            px: { xs: 1, md: 2 },
            py: { xs: 2, md: 1 },
            mt: 4,
          }}
        >
          <Link href={contributionLink} legacyBehavior passHref>
            <MuiLink
              sx={{
                lineBreak: "anywhere",
                fontWeight: 700,
                textAlign: "center",
                mb: { xs: 2, md: 0 },
              }}
            >
              {contributionLink}
            </MuiLink>
          </Link>
          <XlLoadingButton
            variant="outlined"
            onClick={() => {
              navigator.clipboard.writeText(contributionLink);
              showToastSuccess("Link copied");
            }}
          >
            Copy
          </XlLoadingButton>
        </Box>
      </Box>
    );
  }

  return <></>;
}
