import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import React from "react";

export function getServerSideProps() {
  return {
    redirect: {
      permanent: false,
      destination: "/signin",
    },
  };
}

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();

  return <></>;
}
