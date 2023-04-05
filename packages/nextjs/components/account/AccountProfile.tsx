import { useEffect, useState } from "react";
import Link from "next/link";
import { AlternateEmail, Instagram, Language, Telegram, Twitter } from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useAccount } from "wagmi";
import { FullWidthSkeleton, XlLoadingButton } from "~~/components/styled";
import ProfileUriDataEntity from "~~/entities/uri/ProfileUriDataEntity";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth/useScaffoldContractRead";
import useError from "~~/hooks/useError";
import useIpfs from "~~/hooks/useIpfs";
import { emojiAvatarForAddress } from "~~/utils/avatars";
import { addressToShortAddress, ipfsUriToHttpUri } from "~~/utils/converters";

/**
 * A component with account profile.
 */
export default function AccountProfile(props: { address: string }) {
  const { handleError } = useError();
  const { address } = useAccount();
  const { loadJsonFromIpfs } = useIpfs();
  const [profileData, setProfileData] = useState<ProfileUriDataEntity | null | undefined>();

  // Contract states
  const {
    data: profileUri,
    status: readProfileUriStatus,
    error: readProfileUriError,
  } = useScaffoldContractRead({
    contractName: "Profile",
    functionName: "getURI",
    args: [props.address],
  });

  const { data: accountReputation } = useScaffoldContractRead({
    contractName: "Contribution",
    functionName: "getAccountReputation",
    args: [props.address],
  });

  /**
   * Load profile data from ipfs when contract reading is successed.
   */
  useEffect(() => {
    if (readProfileUriStatus === "success") {
      if (profileUri) {
        loadJsonFromIpfs(profileUri)
          .then(result => setProfileData(result))
          .catch(error => handleError(error, true));
      } else {
        setProfileData(null);
      }
    }
    if (readProfileUriStatus === "error" && readProfileUriError) {
      setProfileData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.address, readProfileUriStatus, readProfileUriError, profileUri]);

  if (profileData !== undefined) {
    return (
      <>
        {/* Image */}
        <Box sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 164,
              height: 164,
              borderRadius: 164,
              background: emojiAvatarForAddress(props.address).color,
            }}
            src={profileData?.image ? ipfsUriToHttpUri(profileData.image) : undefined}
          >
            <Typography fontSize={64}>{emojiAvatarForAddress(props.address).emoji}</Typography>
          </Avatar>
        </Box>
        {/* Name */}
        {profileData?.attributes?.[0]?.value && (
          <Typography variant="h4" fontWeight={700} textAlign="center">
            {profileData.attributes[0].value}
          </Typography>
        )}
        {/* About */}
        {profileData?.attributes?.[1]?.value && (
          <Typography textAlign="center" sx={{ maxWidth: 480, mt: 1 }}>
            {profileData.attributes[1].value}
          </Typography>
        )}
        {/* Links and other data */}
        <Stack direction={{ xs: "column-reverse", md: "row" }} alignItems="center" mt={1.5}>
          {/* Email and links */}
          <Stack direction="row" alignItems="center">
            {profileData?.attributes?.[2]?.value && (
              <IconButton
                href={`mailto:${profileData.attributes[2].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <AlternateEmail />
              </IconButton>
            )}
            {profileData?.attributes?.[3]?.value && (
              <IconButton href={profileData.attributes[3].value} target="_blank" component="a" color="primary">
                <Language />
              </IconButton>
            )}
            {profileData?.attributes?.[4]?.value && (
              <IconButton
                href={`https://twitter.com/${profileData.attributes[4].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Twitter />
              </IconButton>
            )}
            {profileData?.attributes?.[5]?.value && (
              <IconButton
                href={`https://t.me/${profileData.attributes[5].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Telegram />
              </IconButton>
            )}
            {profileData?.attributes?.[6]?.value && (
              <IconButton
                href={`https://instagram.com/${profileData.attributes[6].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Instagram />
              </IconButton>
            )}
            {(profileData?.attributes?.[2]?.value ||
              profileData?.attributes?.[3]?.value ||
              profileData?.attributes?.[4]?.value ||
              profileData?.attributes?.[5]?.value ||
              profileData?.attributes?.[6]?.value) && (
              <Divider
                flexItem
                orientation="vertical"
                variant="middle"
                sx={{
                  display: { xs: "none", md: "block" },
                  borderRightWidth: 4,
                  ml: 1.3,
                  mr: 2,
                }}
              />
            )}
          </Stack>
          {/* Address, reputation */}
          <Stack direction="row" alignItems="center" sx={{ mb: { xs: 1, md: 0 } }}>
            <Typography fontWeight={700} sx={{ mr: 1.5 }}>
              {addressToShortAddress(props.address)}
            </Typography>
            {accountReputation && (
              <Tooltip title="Confirmed contributions">
                <Typography fontWeight={700} sx={{ mr: 1.5, cursor: "help" }}>
                  🍭 {accountReputation.confirmedContributions.toString()}
                </Typography>
              </Tooltip>
            )}
          </Stack>
        </Stack>
        {/* Owner buttons */}
        {address === props.address && (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {/* Edit button */}
            <Link href="/accounts/edit" legacyBehavior>
              <XlLoadingButton variant="contained">{profileData ? "Edit Profile" : "Create Profile"}</XlLoadingButton>
            </Link>
          </Stack>
        )}
      </>
    );
  }

  return <FullWidthSkeleton />;
}
