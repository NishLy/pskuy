import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import ShowOffers from "./(__components)/special_offers";
import Unauthorized from "../(__components)/unauthorized";
import Category from "../(__components)/category";
import useAuth from "@/hooks/useAuth";
import cookies from "@/lib/cookies";

export default function index() {
  if (!useAuth()) return <Unauthorized />;

  return (
    <Stack spacing={2} sx={{ scrollSnapType: "y mandatory" }}>
      <Box padding={1}>
        <Typography variant="overline" mt="0" gutterBottom color="white">
          Get Ready,{" "}
        </Typography>
        <Typography
          marginLeft="auto"
          gutterBottom
          component="span"
          textTransform="capitalize"
          color="#d2edf7"
        >
          {cookies.get("username") ?? ""}
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
