import { Box, Tabs, Tab, useTheme, Stack } from "@mui/material";
import React from "react";
import SwipeableViews from "react-swipeable-views";
import RoomGrid from "./room_grid";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

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
type Props = {
  id_rental?: number;
  active?: boolean;
};

export default function Category(props: Props) {
  const theme = useTheme();

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
        maxWidth: "xs",
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
        sx={{
          scrollSnapAlign: "start",
          scrollSnapType: "y mandatory",
        }}
      >
        <Tab
          label={
            <Stack direction="row" alignItems="center">
              <SportsEsportsIcon sx={{ mr: 1 }} />
              <span> Semua</span>
            </Stack>
          }
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center">
              <SportsEsportsIcon sx={{ mr: 1 }} />
              <span> PS5</span>
            </Stack>
          }
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center">
              <SportsEsportsIcon sx={{ mr: 1 }} />
              <span> PS4</span>
            </Stack>
          }
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center">
              <SportsEsportsIcon sx={{ mr: 1 }} />
              <span> PS3</span>
            </Stack>
          }
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center">
              <SportsEsportsIcon sx={{ mr: 1 }} />
              <span> PS2</span>
            </Stack>
          }
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center">
              <SportsEsportsIcon sx={{ mr: 1 }} />
              <span> PS1</span>
            </Stack>
          }
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center">
              <SportsEsportsIcon sx={{ mr: 1 }} />
              <span> XBOX 360</span>
            </Stack>
          }
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center">
              <SportsEsportsIcon sx={{ mr: 1 }} />
              <span> XBOX ONE</span>
            </Stack>
          }
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center">
              <SportsEsportsIcon sx={{ mr: 1 }} />
              <span> XBOX X</span>
            </Stack>
          }
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center">
              <SportsEsportsIcon sx={{ mr: 1 }} />
              <span> NITENDO SWITCH</span>
            </Stack>
          }
        />
        <Tab
          label={
            <Stack direction="row" alignItems="center">
              <SportsEsportsIcon sx={{ mr: 1 }} />
              <span> STEAM DECK</span>
            </Stack>
          }
        />
      </Tabs>

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <RoomGrid
            active={props.active}
            category="semua"
            id_rental={props.id_rental}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <RoomGrid
            active={props.active}
            category="ps5"
            id_rental={props.id_rental}
          />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <RoomGrid
            active={props.active}
            category={"ps4"}
            id_rental={props.id_rental}
          />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <RoomGrid
            active={props.active}
            category={"ps3"}
            id_rental={props.id_rental}
          />
        </TabPanel>
        <TabPanel value={value} index={4} dir={theme.direction}>
          <RoomGrid
            active={props.active}
            category={"ps2"}
            id_rental={props.id_rental}
          />
        </TabPanel>
        <TabPanel value={value} index={5} dir={theme.direction}>
          <RoomGrid
            active={props.active}
            category={"ps1"}
            id_rental={props.id_rental}
          />
        </TabPanel>
        <TabPanel value={value} index={6} dir={theme.direction}>
          <RoomGrid
            active={props.active}
            category={"xbox 360"}
            id_rental={props.id_rental}
          />
        </TabPanel>
        <TabPanel value={value} index={7} dir={theme.direction}>
          <RoomGrid
            active={props.active}
            category={"xbox one"}
            id_rental={props.id_rental}
          />
        </TabPanel>
        <TabPanel value={value} index={8} dir={theme.direction}>
          <RoomGrid
            active={props.active}
            category={"xbox x"}
            id_rental={props.id_rental}
          />
        </TabPanel>
        <TabPanel value={value} index={9} dir={theme.direction}>
          <RoomGrid
            active={props.active}
            category={"nitendo switch"}
            id_rental={props.id_rental}
          />
        </TabPanel>
        <TabPanel value={value} index={10} dir={theme.direction}>
          <RoomGrid
            active={props.active}
            category={"steam deck"}
            id_rental={props.id_rental}
          />
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
