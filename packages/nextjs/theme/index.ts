import { components } from "./components";
import { palette } from "./palette";
import { typography } from "./typography";
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette,
  typography,
  components,
});
