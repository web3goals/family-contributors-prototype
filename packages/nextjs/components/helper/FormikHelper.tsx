import { useEffect } from "react";
import { useFormikContext } from "formik";

/**
 * Component to help use formik.
 */
export default function FormikHelper(props: { onChange?: (values: any) => void }) {
  const { values } = useFormikContext();
  useEffect(() => {
    props.onChange?.(values);
  }, [props, values]);

  return <></>;
}
