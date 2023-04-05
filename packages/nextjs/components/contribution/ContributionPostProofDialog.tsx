import { useEffect, useState } from "react";
import FormikHelper from "../helper/FormikHelper";
import { WidgetBox, WidgetInputTextField, WidgetSeparatorText, WidgetTitle, XxlLoadingButton } from "../styled";
import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import { BigNumber } from "ethers";
import { Form, Formik } from "formik";
import Dropzone from "react-dropzone";
import { useWaitForTransaction } from "wagmi";
import * as yup from "yup";
import ProofUriDataEntity from "~~/entities/uri/ProofUriDataEntity";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import useError from "~~/hooks/useError";
import useIpfs from "~~/hooks/useIpfs";
import useToasts from "~~/hooks/useToast";
import { palette } from "~~/theme/palette";

/**
 * Dialog to post contribution proof.
 */
export default function ContributionPostProofDialog(props: {
  id: string;
  onSuccess?: () => void;
  isClose?: boolean;
  onClose?: () => void;
}) {
  const { handleError } = useError();
  const { showToastSuccess } = useToasts();
  const { uploadFileToIpfs, uploadJsonToIpfs } = useIpfs();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // Form states
  const [formFileValue, setFormFileValue] = useState<{
    file: any;
    uri: any;
    isImage: boolean;
    isVideo: boolean;
  }>();
  const [formValues, setFormValues] = useState({
    description: "",
  });
  const formValidationSchema = yup.object({
    description: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Uri states
  const [proofUri, setProofUri] = useState("");

  // Contract states
  const {
    writeAsync: contractWriteAsync,
    isLoading: isContractLoading,
    data: contractData,
  } = useScaffoldContractWrite({
    contractName: "Contribution",
    functionName: "postProof",
    args: [BigNumber.from(props.id), proofUri],
  });
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransaction({
    hash: contractData?.hash,
  });

  const isFormDisabled = isFormSubmitting || isContractLoading || isTransactionLoading || isTransactionSuccess;

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  async function onProofChange(files: Array<any>) {
    try {
      // Get file
      const file = files?.[0];
      if (!file) {
        return;
      }
      // Read and save file
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          setFormFileValue({
            file: file,
            uri: fileReader.result,
            isImage: file.type === "image/jpeg" || file.type === "image/png",
            isVideo: file.type === "video/mp4",
          });
        }
      };
      fileReader.readAsDataURL(file);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  async function submit(values: any) {
    try {
      setIsFormSubmitting(true);
      // Check file
      if (!formFileValue?.file) {
        throw new Error("File is not attached");
      }
      // Upload file to ipfs
      const { uri: fileUri } = await uploadFileToIpfs(formFileValue.file);
      // Add file to proof
      const proofUriData: ProofUriDataEntity = {
        description: values.description,
        type: formFileValue.isImage ? "IMAGE" : formFileValue.isVideo ? "VIDEO" : "FILE",
        addedData: new Date().getTime(),
        uri: fileUri,
      };
      // Upload proof to ipfs
      const { uri: proofUri } = await uploadJsonToIpfs(proofUriData);
      setProofUri(proofUri);
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  /**
   * Write data to contract if form was submitted.
   */
  useEffect(() => {
    if (proofUri !== "" && contractWriteAsync && !isContractLoading) {
      contractWriteAsync?.();
      setProofUri("");
      setIsFormSubmitting(false);
    }
  }, [proofUri, contractWriteAsync, isContractLoading]);

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Proof is added and will appear soon");
      props.onSuccess?.();
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransactionSuccess]);

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          my: 2,
        }}
      >
        {/* Title */}
        <Typography variant="h4" fontWeight={700} textAlign="center">
          👀 Add proof
        </Typography>
        <WidgetSeparatorText mt={2} mb={4}>
          it can be a screenshot, photo, video or any other file
        </WidgetSeparatorText>
        <Formik initialValues={formValues} validationSchema={formValidationSchema} onSubmit={submit}>
          {({ values, errors, touched, handleChange }) => (
            <Form style={{ width: "100%" }}>
              <FormikHelper onChange={(values: any) => setFormValues(values)} />
              {/* Description */}
              <WidgetBox bgcolor={palette.purpleLight}>
                <WidgetTitle>Message</WidgetTitle>
                <WidgetInputTextField
                  id="description"
                  name="description"
                  placeholder="I did..."
                  value={values.description}
                  onChange={handleChange}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  disabled={isFormDisabled}
                  multiline
                  maxRows={4}
                  sx={{ width: 1 }}
                />
              </WidgetBox>
              {/* File */}
              <WidgetBox bgcolor={palette.purpleDark} mt={2} sx={{ width: 1 }}>
                <WidgetTitle>File</WidgetTitle>
                <Dropzone multiple={false} disabled={isFormDisabled} onDrop={files => onProofChange(files)}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <Box
                        sx={{
                          cursor: !isFormDisabled ? "pointer" : undefined,
                          bgcolor: "#FFFFFF",
                          py: 2,
                          px: 2,
                          borderRadius: 3,
                        }}
                      >
                        <Typography color="text.disabled" sx={{ lineBreak: "anywhere" }}>
                          {formFileValue?.file?.name || "Drag 'n' drop some files here, or click to select files"}
                        </Typography>
                      </Box>
                    </div>
                  )}
                </Dropzone>
              </WidgetBox>
              {/* Submit button */}
              <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <XxlLoadingButton
                  loading={isFormSubmitting || isContractLoading || isTransactionLoading}
                  variant="contained"
                  type="submit"
                  disabled={isFormDisabled || !contractWriteAsync}
                >
                  Post
                </XxlLoadingButton>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
