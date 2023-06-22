import { Box, Tabs, Tab, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import RoomGrid from "./room_grid";

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
        height: "calc(100vh - 180px)",
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

export default function Category() {
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
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="full width tabs example"
      >
        <Tab label="semua" />
        <Tab label="PS5" />
        <Tab label="PS4" />
        <Tab label="PS3" />
        <Tab label="PS2" />
        <Tab label="PS1" />
        <Tab label="XBOX 360" />
        <Tab label="XBOX ONE" />
        <Tab label="XBOX " />
        <Tab label="NITENDO SWICTH" />
        <Tab label="NITENDO WII" />
      </Tabs>

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <RoomGrid category="semua" />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <RoomGrid category="semua" />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <RoomGrid category={"ps4"} />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <RoomGrid category={"ps3"} />
        </TabPanel>
        <TabPanel value={value} index={4} dir={theme.direction}>
          <RoomGrid category={"ps2"} />
        </TabPanel>
        <TabPanel value={value} index={5} dir={theme.direction}>
          <RoomGrid category={"ps1"} />
        </TabPanel>
        <TabPanel value={value} index={6} dir={theme.direction}>
          <RoomGrid category={"xbox 3606"} />
        </TabPanel>
        <TabPanel value={value} index={7} dir={theme.direction}>
          <RoomGrid category={router.query.search as string} />
        </TabPanel>
        <TabPanel value={value} index={8} dir={theme.direction}>
          <RoomGrid category={router.query.search as string} />
        </TabPanel>
        <TabPanel value={value} index={9} dir={theme.direction}>
          <RoomGrid category={router.query.search as string} />
        </TabPanel>
        <TabPanel value={value} index={10} dir={theme.direction}>
          <RoomGrid category={router.query.search as string} />
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
