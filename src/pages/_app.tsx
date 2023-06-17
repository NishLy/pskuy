import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React from "react";
import type { AppType } from "next/app";
import MainLayout from "@/pages/__layouts/main_menu";
import trpc from "@/utils/trpc";
import AppContext from "@/context/app";
import { inferAsyncReturnType } from "@trpc/server";
import createContext from "./api/trpc/__context";
import cookies from "@/lib/cookies";
import NextNProgress from "nextjs-progressbar";
import { useRouter } from "next/router";

const defaultTheme = createTheme({ palette: { mode: "light" } });
// eslint-disable-next-line react/prop-types
const MyApp: AppType = ({ Component, pageProps, router }) => {
  const routerPages = useRouter();
  const [userContext, setUserContext] = React.useState<
    inferAsyncReturnType<typeof createContext> | undefined
  >();

  trpc.validateUserTypeById.useQuery(
    {
      id: cookies.get("uuid") ?? "",
      type: (cookies.get("user_type") as "user" | "owner") ?? "",
    },
    {
      onSuccess(data) {
        if (!data) return routerPages.replace("/signin");
        return setUserContext({
          email: cookies.get("email"),
          profile_photo: cookies.get("profile_photo"),
          token: cookies.get("token"),
          user_type: cookies.get("user_type"),
          username: cookies.get("username"),
          uuid: cookies.get("uuid"),
        });
      },
    }
  );

  return (
    <AppContext.Provider value={[userContext, setUserContext]}>
      <ThemeProvider theme={defaultTheme}>
        <NextNProgress />
        <MainLayout
          Component={Component}
          pageProps={pageProps}
          router={router}
        />
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default trpc.withTRPC(MyApp);
