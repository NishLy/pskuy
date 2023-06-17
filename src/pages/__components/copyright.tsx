import { Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 8, mb: 4 }}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Pskuiy
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
