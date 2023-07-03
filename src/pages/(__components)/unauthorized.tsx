import { useRouter } from "next/router";
import React from "react";
import UnauthorizedPage from "../401";
import useAuth from "@/hooks/useAuth";
import { Typography } from "@mui/material";

export default function Unauthorized() {
  const router = useRouter();

  React.useEffect(() => {
    const timeout = setTimeout(invoke, 5000);
    function invoke() {
      if (!useAuth()) return router.replace("/401");
      clearTimeout(timeout);
    }
  }, []);

  return <Typography variant="overline">Session Error</Typography>;
}
