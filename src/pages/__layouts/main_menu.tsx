import React, { Suspense } from "react";
import { Container } from "@mui/material";
import { NextComponentType, NextPageContext } from "next/types";
import ElevateAppBar from "../__components/app_bar";
import FixedBottomNavigation from "../__components/button_nav";

function isExisted(str: string, arr: string[]) {
  for (let index = 0; index < arr.length; index++) {
    if (str.match(`/${arr[index]}`)) return true;
  }
  return false;
}

const MainLayout = ({
  Component,
  pageProps,
  router,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any;
}) => {
  /* This code block is checking if the current `router.pathname` matches any of the strings in the
  array `["home", "manage", "orders", "view", "explore"]`. If there is a match, it returns the
  `Layout` component with the `Component` and `pageProps` props passed to it. If there is no match,
  it returns the `Component` with the `pageProps` props passed to it. */
  if (
    isExisted(router.pathname, [
      "home",
      "manage",
      "orders",
      "view",
      "explore",
      "search",
      "register",
    ])
  )
    return <Layout Component={Component} pageProps={pageProps} />;

  return <Component {...pageProps} />;
};

export default MainLayout;

export function Layout({
  Component,
  pageProps,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: NextComponentType<NextPageContext, any, any>;
  pageProps: Record<string, unknown>;
}) {
  return (
    <>
      <Container sx={{ padding: 0 }} maxWidth="xs">
        <ElevateAppBar />
        <Container
          sx={{
            paddingTop: "60px",
            marginBottom: "60px",
            minWidth: "100%",
            minHeight: "50vh",
            paddingX: 0,
            backgroundImage: "url('/images/22.png')",
            backgroundPosition: "top",
            backgroundSize: "contain",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
          }}
          component="main"
          maxWidth="xs"
        >
          <Suspense fallback={<h1>Loading....</h1>}>
            <Component {...pageProps} />
          </Suspense>
        </Container>
        <FixedBottomNavigation />
      </Container>
    </>
  );
}
