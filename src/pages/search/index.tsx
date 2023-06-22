import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import RoomGrid from "../__components/room_grid";
import { useRouter } from "next/router";
import RentalCardSearch from "../__components/rental_card";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{
        height: "calc(100vh - 200px)",
        overflowY: "auto",
        paddingTop: 2,
      }}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

export default function Search() {
  const theme = useTheme();
  const router = useRouter();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        width: "100%",
        marginTop: 1,
        overflowY: "hidden",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="Kategori" />
        <Tab label="Tempat Rental" />
      </Tabs>

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <RoomGrid category={router.query.search as string} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <RentalCardSearch searchQuery={router.query.search as string} />
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
