import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from "@mui/lab";
import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Layout from "~~/components/layout";
import { CentralizedBox, LandingTimelineDot, XxlLoadingButton } from "~~/components/styled";

export default function Landing() {
  return (
    <Layout maxWidth={false} disableGutters={true} hideToolbar={true} sx={{ pt: 0 }}>
      <CentralizedBox sx={{ mt: 0 }}>
        {/* Header */}
        <Box
          sx={{
            backgroundImage: `url(/assets/header.png)`,
            backgroundSize: "cover",
            minHeight: "100vh",
            width: 1,
          }}
        >
          {/* Header content */}
          <Container
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "md",
              color: "#FFFFFF",
            }}
          >
            <Typography variant="h1" textAlign="center" mt={8}>
              A <strong>web3 space</strong> where parents reward children for <strong>valuable actions</strong>
            </Typography>
            <XxlLoadingButton
              variant="contained"
              href="/contributions/publish"
              sx={{
                color: "purpleLight",
                background: "#FFFFFF",
                ":hover": { background: "#FFFFFF" },
                mt: 4,
              }}
            >
              Ask for Contribution
            </XxlLoadingButton>
          </Container>
        </Box>
        {/* Content */}
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "md",
          }}
        >
          {/* How it works */}
          <Typography variant="h4" fontWeight={700} sx={{ mt: 12, mb: 3 }} textAlign="center">
            How does it work?
          </Typography>
          <Timeline
            sx={{
              mt: 2,
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
            }}
          >
            {/* Step one */}
            <TimelineItem>
              <TimelineSeparator>
                <LandingTimelineDot sx={{ borderColor: "blue" }} variant="outlined">
                  <Typography fontSize={32}>🍭</Typography>
                </LandingTimelineDot>
                <TimelineConnector sx={{ height: 12 }} />
              </TimelineSeparator>
              <TimelineContent display="flex" alignItems="center">
                <Typography variant="h6" fontWeight={700} maxWidth={320}>
                  Publish an asking for a contribution
                </Typography>
              </TimelineContent>
            </TimelineItem>
            {/* Step two */}
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector sx={{ height: 12 }} />
                <LandingTimelineDot sx={{ borderColor: "yellow" }} variant="outlined">
                  <Typography fontSize={32}>🔗</Typography>
                </LandingTimelineDot>
                <TimelineConnector sx={{ height: 12 }} />
              </TimelineSeparator>
              <TimelineContent display="flex" alignItems="center">
                <Typography variant="h6" fontWeight={700} maxWidth={320}>
                  Share the link with your family
                </Typography>
              </TimelineContent>
            </TimelineItem>
            {/* Step three */}
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector sx={{ height: 12 }} />
                <LandingTimelineDot sx={{ borderColor: "purpleLight" }} variant="outlined">
                  <Typography fontSize={32}>👀</Typography>
                </LandingTimelineDot>
                <TimelineConnector sx={{ height: 12 }} />
              </TimelineSeparator>
              <TimelineContent display="flex" alignItems="center">
                <Typography variant="h6" fontWeight={700} maxWidth={320}>
                  Confirm the contribution with the provided proof
                </Typography>
              </TimelineContent>
            </TimelineItem>
            {/* Step four */}
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector sx={{ height: 12 }} />
                <LandingTimelineDot sx={{ borderColor: "green" }} variant="outlined">
                  <Typography fontSize={32}>😊</Typography>
                </LandingTimelineDot>
              </TimelineSeparator>
              <TimelineContent display="flex" alignItems="center">
                <Typography variant="h6" fontWeight={700} maxWidth={320}>
                  Become happy parent!
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Container>
      </CentralizedBox>
    </Layout>
  );
}
