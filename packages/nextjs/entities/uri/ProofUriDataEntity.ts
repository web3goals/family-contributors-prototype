export default interface ProofUriDataEntity {
  description?: string;
  type?: "FILE" | "IMAGE" | "VIDEO" | "LIVEPEER_VIDEO";
  addedData?: number;
  uri?: string;
  livepeerPlaybackId?: string;
}
