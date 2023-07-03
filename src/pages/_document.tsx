import { Html, Head, Main, NextScript } from "next/document";
import React from "react";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
        <script
          src={
            "https://maps.googleapis.com/maps/api/js?key=" +
            process.env.NEXT_PUBLIC_GOOGLE_MAP_API_TOKEN
          }
          defer
        ></script>
      </Head>
      <body
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
