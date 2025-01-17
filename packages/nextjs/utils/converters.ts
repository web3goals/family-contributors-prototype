import { BigNumber, ethers } from "ethers";
import { errorsLibraryAbi } from "~~/contracts/abi/errorsLibrary";

/**
 * Convert "0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1" to "0x430...c4b1".
 */
export function addressToShortAddress(address: string): string {
  let shortAddress = address;
  if (address?.length > 10) {
    shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  return shortAddress?.toLowerCase();
}

/**
 * Convert "ipfs://..." to "http://...".
 */
export function ipfsUriToHttpUri(ipfsUri: string): string {
  if (!ipfsUri || !ipfsUri.startsWith("ipfs://")) {
    throw new Error(`Fail to converting IPFS URI to HTTP URI: ${ipfsUri}`);
  }
  return ipfsUri.replace("ipfs://", "https://w3s.link/ipfs/");
}

/**
 * Convert "ipfs://bafkreicly5njual3zhcvdvqdvsyme3kcxxjguokz2taagkkvnbicm2u6ym" to "ipfs://bafk...2u6ym".
 */
export function ipfsUriToShortUri(ipfsUri: string): string {
  let shortIpfsUri = ipfsUri;
  if (ipfsUri?.length > 16) {
    shortIpfsUri = `${ipfsUri.substring(0, 11)}...${ipfsUri.substring(ipfsUri.length - 4)}`;
  }
  return shortIpfsUri?.toLowerCase();
}

/**
 * Convert error object to pretty object with error message and severity.
 */
export function errorToPrettyError(error: any): {
  message: string;
  severity: "info" | "error" | undefined;
} {
  let message = JSON.stringify(error);
  const severity: "info" | "error" | undefined = undefined;
  if (error?.message) {
    message = error.message;
  }
  if (error?.data?.message) {
    message = error.data.message.replace("execution reverted: ", "");
  }
  if (error?.error?.data?.message) {
    message = error.error.data.message.replace("execution reverted: ", "");
  }
  if (error?.error?.data?.data) {
    message = new ethers.utils.Interface(errorsLibraryAbi).parseError(error.error.data.data).signature;
  }
  return {
    message: message,
    severity: severity,
  };
}

/**
 * Convert number like "0.01" to big number "10000000000000000".
 */
export function numberToBigNumberEthers(number?: number): BigNumber {
  if (!number) {
    return ethers.constants.Zero;
  }
  return ethers.utils.parseEther(number.toString());
}

/**
 * Convert date object to big number "1677628800".
 */
export function dateToBigNumberTimestamp(date?: Date): BigNumber {
  if (!date) {
    return ethers.constants.Zero;
  }
  return BigNumber.from(date.getTime()).div(BigNumber.from(1000));
}

/**
 * Convert date like "2023-03-01" to big number "1677628800".
 */
export function dateStringToBigNumberTimestamp(date?: string): BigNumber {
  if (!date) {
    return ethers.constants.Zero;
  }
  return BigNumber.from(new Date(date).getTime() / 1000);
}

/**
 * Convert big number like "1677628800" to string "3/1/2023".
 */
export function bigNumberTimestampToLocaleDateString(timestamp?: BigNumber): string {
  if (!timestamp) {
    return "Unknown";
  }
  return new Date(timestamp.toNumber() * 1000).toLocaleDateString();
}

/**
 * Convert string like "1677628800" to string "3/14/2023, 5:33:26 PM".
 */
export function stringTimestampToLocaleString(timestamp?: string, disableMsMultiplicator = false): string {
  if (!timestamp) {
    return "Unknown";
  }
  return timestampToLocaleString(Number(timestamp), disableMsMultiplicator);
}

/**
 * Convert number like "1677628800" to string "3/14/2023, 5:33:26 PM".
 */
export function timestampToLocaleString(timestamp?: number, disableMsMultiplicator = false): string {
  if (!timestamp) {
    return "Unknown";
  }
  if (disableMsMultiplicator) {
    return new Date(timestamp).toLocaleString();
  }
  return new Date(timestamp * 1000).toLocaleString();
}
