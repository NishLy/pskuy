import { useRouter } from "next/router";
import React from "react";
import useAuth from "@/hooks/useAuth";
import { CircularProgress, Container, Typography } from "@mui/material";

export default function Unauthorized() {
  const router = useRouter();

  React.useEffect(() => {
    const timeout = setTimeout(invoke, 5000);
    function invoke() {
      if (!useAuth()) return router.replace("/401");
      clearTimeout(timeout);
    }
    return;
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.paper",
        width: "100vw",
        position: "fixed",
        flexDirection: "column",
        zIndex: 15000,
        height: "100vh",
      }}
    >
      <CircularProgress />
      <Typography mt={2} variant="h5">
        Loading...
      </Typography>
    </Container>
  );
}
