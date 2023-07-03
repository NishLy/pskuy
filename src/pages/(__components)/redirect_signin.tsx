import { useRouter } from "next/router";
import React from "react";

export default function RedirectSignin() {
  const router = useRouter();
  React.useEffect(() => {
    setTimeout(() => router.replace("/signin"), 1000);
  }, []);
  return <h1>Invalid Kredensial</h1>;
}
