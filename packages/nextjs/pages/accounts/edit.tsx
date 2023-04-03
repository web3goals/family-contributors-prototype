import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AccountEditProfileForm from "~~/components/account/AccountEditProfileForm";
import Layout from "~~/components/layout";
import { CentralizedBox, FullWidthSkeleton } from "~~/components/styled";
import ProfileUriDataEntity from "~~/entities/uri/ProfileUriDataEntity";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import useError from "~~/hooks/useError";
import useIpfs from "~~/hooks/useIpfs";

/**
 * Page to edit account.
 */
export default function EditAccount() {
  const { handleError } = useError();
  const { address } = useAccount();
  const { loadJsonFromIpfs } = useIpfs();
  const [profileData, setProfileData] = useState<ProfileUriDataEntity | null | undefined>();

  const {
    data: contractData,
    status: contractStatus,
    error: contractError,
  } = useScaffoldContractRead({
    contractName: "Profile",
    functionName: "getURI",
    args: [address],
  });

  useEffect(() => {
    if (address && contractStatus === "success") {
      if (contractData) {
        loadJsonFromIpfs(contractData)
          .then(result => setProfileData(result))
          .catch(error => handleError(error, true));
      } else {
        setProfileData(null);
      }
    }
    if (address && contractStatus === "error" && contractError) {
      setProfileData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contractStatus, contractError, contractData]);

  return (
    <Layout maxWidth="xs">
      <CentralizedBox>
        {profileData !== undefined ? <AccountEditProfileForm profileData={profileData} /> : <FullWidthSkeleton />}
      </CentralizedBox>
    </Layout>
  );
}
