import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

export default function NotFoundPage() {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xs">
        <Stack alignItems="center">
          <Image
            alt={"Halaman Tidak ditemukan :("}
            width="800"
            height="800"
            style={{ width: "100%", aspectRatio: "1/1", height: "fit-content" }}
            src="\images\errors\404_PAGE_NOT_FOUND.svg"
          />
          <Typography variant="h5" fontFamily="cursive">
            {router.query.message
              ? router.query.message
              : "Halaman Tidak ditemukan :("}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
