import axios from "axios";
import { Web3Storage } from "web3.storage";
import { ipfsUriToHttpUri } from "~~/utils/converters";

/**
 * Hook for work with IPFS.
 */
export default function useIpfs() {
  const ipfsUriPrefix = "ipfs://";
  const web3Storage = new Web3Storage({
    token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY || "",
    endpoint: new URL("https://api.web3.storage"),
  });

  const uploadFileToIpfs = async function (file: any) {
    const cid = await web3Storage.put([file], { wrapWithDirectory: false });
    const uri = `${ipfsUriPrefix}${cid}`;
    return { cid, uri };
  };

  const uploadJsonToIpfs = async function (json: object) {
    const file = new File([JSON.stringify(json)], "", {
      type: "text/plain",
    });
    const cid = await web3Storage.put([file], { wrapWithDirectory: false });
    const uri = `${ipfsUriPrefix}${cid}`;
    return { cid, uri };
  };

  const loadJsonFromIpfs = async function (uri: string) {
    const response = await axios.get(ipfsUriToHttpUri(uri));
    if (response.data.errors) {
      throw new Error(`Fail to loading json from IPFS: ${response.data.errors}`);
    }
    return response.data;
  };

  return {
    uploadFileToIpfs,
    uploadJsonToIpfs,
    loadJsonFromIpfs,
  };
}
