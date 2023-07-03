import { Grid, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";

export default function NoFoundSpalsh() {
  return (
    <Grid
      item
      width="100%"
      height="70vh"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        src="/images/errors/NO_DATA_FOUND.svg"
        alt={"Data tidak ditemukan"}
        style={{ width: "100%", height: "fit-content" }}
        width={800}
        height={800}
      />
      <Typography variant="h5" fontFamily="cursive">
        Opps... hasil tidak ditemukan
      </Typography>
    </Grid>
  );
}
