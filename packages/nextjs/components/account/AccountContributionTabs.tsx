import { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { SxProps, Tab } from "@mui/material";
import { Box } from "@mui/system";

/**
 * A component with tabs with contributions.
 */
export default function AccountContributionTabs(props: { address: string; sx?: SxProps }) {
  const [tabValue, setTabValue] = useState("1");

  function handleChange(_: any, newTabValue: any) {
    setTabValue(newTabValue);
  }

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      <TabContext value={tabValue}>
        <TabList
          centered
          onChange={handleChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 1,
          }}
        >
          <Tab label="Published" value="1" />
          <Tab label="Asked to contribute" value="2" />
        </TabList>
        <TabPanel value="1" sx={{ px: 0 }}>
          ...
          {/* TODO: Display contribution list */}
        </TabPanel>
        <TabPanel value="2" sx={{ px: 0 }}>
          ...
          {/* TODO: Display contribution list */}
        </TabPanel>
      </TabContext>
    </Box>
  );
}
