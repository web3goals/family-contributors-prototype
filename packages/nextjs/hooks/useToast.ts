import { truncate } from "lodash";
import { useSnackbar } from "notistack";
import { errorToPrettyError } from "~~/utils/converters";

/**
 * Hook for work with toasts.
 */
export default function useToasts() {
  const { enqueueSnackbar } = useSnackbar();

  const showToastSuccess = function (message: string) {
    enqueueSnackbar(message, {
      variant: "success",
    });
  };

  const showToastError = function (error: any) {
    const prettyError = errorToPrettyError(error);
    enqueueSnackbar(truncate(prettyError.message, { length: 256 }), {
      variant: prettyError.severity === "info" ? "info" : "error",
    });
  };

  return {
    showToastSuccess,
    showToastError,
  };
}
