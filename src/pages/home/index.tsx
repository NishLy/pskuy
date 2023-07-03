import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import ShowOffers from "./(__components)/special_offers";
import RedirectSignin from "../(__components)/redirect_signin";
import Category from "../(__components)/category";
import useAuth from "@/hooks/useAuth";

export default function index() {
  if (!useAuth()) return <RedirectSignin />;

  return (
    <Stack spacing={2}>
      <Box padding={1}>
        <Typography variant="overline" mt="0" gutterBottom color="white">
          Get Ready,
        </Typography>
        <Typography variant="h5" gutterBottom color="white">
          Cari Tempat main mu!
        </Typography>
      </Box>
      <ShowOffers />
      <Category active={true} />
    </Stack>
  );
}
