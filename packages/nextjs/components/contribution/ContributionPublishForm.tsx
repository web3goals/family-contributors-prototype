import { useState } from "react";
import FormikHelper from "../helper/FormikHelper";
import {
  CentralizedBox,
  WidgetBox,
  WidgetInputSelect,
  WidgetInputTextField,
  WidgetSeparatorText,
  WidgetTitle,
  XxlLoadingButton,
} from "../styled";
import { Box, MenuItem, Stack, Typography } from "@mui/material";
import { ethers } from "ethers";
import { Form, Formik } from "formik";
import { useAccount, useWaitForTransaction } from "wagmi";
import * as yup from "yup";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { palette } from "~~/theme/palette";
import { numberToBigNumberEthers } from "~~/utils/converters";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

/**
 * A component with form to publish a contribution.
 */
export default function ContributionPublishForm(props: { onSuccessPublish: (id: string) => void }) {
  const { address } = useAccount();

  // Form states
  const [formValues, setFormValues] = useState({
    description: "Clean up the garage and throw out all the junk",
    potentialContributorOne: "0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1",
    potentialContributorTwo: "0x3F121f9a16bd6C83D325985417aDA3FE0f517B7D",
    potentialContributorThree: "0x788A4fEcC0Ece997B9b64528bc9E10e0219C94A2",
    reward: 0.01,
    rewardCurrency: "native",
  });
  const formValidationSchema = yup.object({
    description: yup.string().required(),
    potentialContributorOne: yup.string().required(),
    potentialContributorTwo: yup.string().required(),
    potentialContributorThree: yup.string().required(),
    reward: yup.number().required(),
    rewardCurrency: yup.string().required(),
  });

  // Contract states
  const {
    writeAsync: contractWriteAsync,
    isLoading: isContractLoading,
    data: contractData,
  } = useScaffoldContractWrite({
    contractName: "Contribution",
    functionName: "publish",
    args: [
      formValues.description,
      numberToBigNumberEthers(formValues.reward),
      [formValues.potentialContributorOne, formValues.potentialContributorTwo, formValues.potentialContributorThree],
    ],
    value: formValues.reward.toString(),
  });
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransaction({
    hash: contractData?.hash,
  });

  const isFormLoading = isContractLoading || isTransactionLoading;
  const isFormDisabled = isFormLoading || isTransactionSuccess;
  const isFormSubmitButtonDisabled = isFormDisabled || !contractWriteAsync;

  // Listen contract events to get id of published contribution.
  useScaffoldEventSubscriber({
    contractName: "Contribution",
    eventName: "Transfer",
    listener: (from, to, tokenId) => {
      if (from === ethers.constants.AddressZero && to === address) {
        props.onSuccessPublish(tokenId.toString());
      }
    },
  });

  return (
    <CentralizedBox>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        🍭 I ask for
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={() => contractWriteAsync?.()}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form style={{ width: "100%" }}>
            <FormikHelper onChange={(values: any) => setFormValues(values)} />
            {/* Description input */}
            <WidgetBox bgcolor={palette.blue} mb={2}>
              <WidgetTitle>Contribution</WidgetTitle>
              <WidgetInputTextField
                id="description"
                name="description"
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
            <WidgetSeparatorText mb={2}>from</WidgetSeparatorText>
            {/* Potential contributor one input */}
            <WidgetBox bgcolor={palette.purpleDark} mb={2}>
              <WidgetTitle>Account #1</WidgetTitle>
              <WidgetInputTextField
                id="potentialContributorOne"
                name="potentialContributorOne"
                value={values.potentialContributorOne}
                onChange={handleChange}
                error={touched.potentialContributorOne && Boolean(errors.potentialContributorOne)}
                helperText={touched.potentialContributorOne && errors.potentialContributorOne}
                disabled={isFormDisabled}
                multiline
                maxRows={4}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Potential contributor two input */}
            <WidgetBox bgcolor={palette.purpleDark} mb={2}>
              <WidgetTitle>Account #2</WidgetTitle>
              <WidgetInputTextField
                id="potentialContributorTwo"
                name="potentialContributorTwo"
                value={values.potentialContributorTwo}
                onChange={handleChange}
                error={touched.potentialContributorTwo && Boolean(errors.potentialContributorTwo)}
                helperText={touched.potentialContributorTwo && errors.potentialContributorTwo}
                disabled={isFormDisabled}
                multiline
                maxRows={4}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Potential contributor three input */}
            <WidgetBox bgcolor={palette.purpleDark} mb={2}>
              <WidgetTitle>Account #3</WidgetTitle>
              <WidgetInputTextField
                id="potentialContributorThree"
                name="potentialContributorThree"
                value={values.potentialContributorThree}
                onChange={handleChange}
                error={touched.potentialContributorThree && Boolean(errors.potentialContributorThree)}
                helperText={touched.potentialContributorThree && errors.potentialContributorThree}
                disabled={isFormDisabled}
                multiline
                maxRows={4}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            <WidgetSeparatorText mb={2}>for a</WidgetSeparatorText>
            {/* Stake input */}
            <WidgetBox bgcolor={palette.green} mb={2}>
              <WidgetTitle>Reward</WidgetTitle>
              <Stack direction="row" spacing={1} sx={{ width: 1 }}>
                <WidgetInputTextField
                  id="reward"
                  name="reward"
                  type="number"
                  value={values.reward}
                  onChange={handleChange}
                  error={touched.reward && Boolean(errors.reward)}
                  helperText={touched.reward && errors.reward}
                  disabled={isFormDisabled}
                  sx={{ flex: 1 }}
                />
                <WidgetInputSelect
                  id="rewardCurrency"
                  name="rewardCurrency"
                  value={values.rewardCurrency}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="native">{getTargetNetwork().nativeCurrency?.symbol}</MenuItem>
                </WidgetInputSelect>
              </Stack>
            </WidgetBox>
            <WidgetSeparatorText mb={3}>
              which will be sent to the first account that makes this contribution and provides proof
            </WidgetSeparatorText>
            {/* Submit button */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <XxlLoadingButton
                loading={isFormLoading}
                variant="contained"
                type="submit"
                disabled={isFormSubmitButtonDisabled}
              >
                Submit
              </XxlLoadingButton>
            </Box>
          </Form>
        )}
      </Formik>
    </CentralizedBox>
  );
}
