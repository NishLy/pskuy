import { Box, Button, Stack, Typography } from "@mui/material";
import * as React from "react";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ShowOffers from "./special_offers";
import RoomGrid from "./room_grid";
import useUserCookies from "@/hooks/useCookies";
import RedirectSignin from "../__components/redirect_signin";

export default function index() {
  const [category, setCategory] = React.useState("semua");
  if (!useUserCookies().token || !useUserCookies().uuid)
    return <RedirectSignin />;
  return (
    <Stack spacing={2}>
      <Box padding={1}>
        <Typography variant="overline" mt="0" gutterBottom>
          Get Ready,
        </Typography>
        <Typography variant="h5" gutterBottom>
          Cari Tempat main mu!
        </Typography>
      </Box>
      <ShowOffers />
      <Box paddingBottom={2} sx={{ overflowX: "auto" }}>
        <Stack
          paddingX={1}
          direction="row"
          spacing={2}
          sx={{ width: "fit-content" }}
        >
          <Button
            variant={category === "semua" ? "contained" : "outlined"}
            onClick={() => setCategory("semua")}
            size="large"
          >
            Semua
          </Button>
          <Button
            variant={category === "ps4" ? "contained" : "outlined"}
            size="large"
            onClick={() => setCategory("ps4")}
          >
            <SportsEsportsIcon />
            PS4
          </Button>
          <Button
            variant={category === "ps5" ? "contained" : "outlined"}
            size="large"
            onClick={() => setCategory("ps5")}
          >
            <SportsEsportsIcon />
            PS5
          </Button>
          <Button
            variant={category === "ps3" ? "contained" : "outlined"}
            size="large"
            onClick={() => setCategory("ps3")}
          >
            <SportsEsportsIcon />
            PS3
          </Button>
          <Button
            variant={category === "ps2" ? "contained" : "outlined"}
            size="large"
            onClick={() => setCategory("ps2")}
          >
            <SportsEsportsIcon />
            PS2
          </Button>
        </Stack>
      </Box>
      <RoomGrid category={category} />
    </Stack>
  );
}
