import { Alert, Container, List, ListItem } from "@mui/material";
import React from "react";
import trpc from "@/utils/trpc";
import UserContext from "@/context/app";
import TRANSACTION_DATA from "@/interfaces/transaction";
import { ROOM_DATA } from "@/interfaces/room";
import RENTAL_DATA from "@/interfaces/rental";
import { CONSOLE_DATA } from "@/interfaces/console";
import TransactionOwnerCard from "./(__components)/transaction_owner_card";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import SuperJSON from "superjson";
import { appRouter } from "../api/trpc/[trpc]";
import createTRPCContext from "../api/trpc/context";
import USER_DATA from "@/interfaces/user";
import Unauthorized from "../(__components)/unauthorized";
import useAuth from "@/hooks/useAuth";
import TransactionSkeleton from "./(__components)/transaction_skeleton";

/**
 * This function is used to get server-side props for a TypeScript React component, including fetching
 * data and preparing it for rendering.
 * @param context - The `context` parameter is an object that contains information about the
 * server-side rendering context. It is of type `GetServerSidePropsContext<{ id_owner: string }>`,
 * which means it has a generic type that specifies the shape of the `context.query` object.
 * @returns an object with a "props" property. The "props" property contains the dehydrated state of
 * the trpc helpers and the id_owner value.
 */
export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id_owner: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: SuperJSON,
  });
  const id_owner = context.query?.id_owner as string;
  await helpers.findAllOwnerTransaction.prefetch({
    parameters: { id_owner },
  });

  return {
    props: JSON.parse(
      JSON.stringify({
        trpcState: helpers.dehydrate(),
        id_owner,
      })
    ),
  };
}

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [userContext] = React.useContext(UserContext);
  if (!useAuth()) return <Unauthorized />;
  const [loading, setLoading] = React.useState(true);
  const [transactions, setTransactions] = React.useState<
    (TRANSACTION_DATA & {
      Rental: RENTAL_DATA;
      User: USER_DATA;
      Room: ROOM_DATA & { Console: CONSOLE_DATA };
    })[]
  >([]);
  const [offset, setOffset] = React.useState(0);
  const [limitOffset, setLimitOffset] = React.useState(0);
  const observer = React.useRef<IntersectionObserver | null>();

  /* The code is using the `useQuery` hook from the `trpc` library to fetch data from the server. */
  const { data, refetch, isFetching, isSuccess } =
    trpc.findAllOwnerTransaction.useQuery({
      parameters: { id_owner: userContext?.uuid ?? props.id_owner },
      offset,
    });

  /* The `lastElement` function is a callback function created using the `React.useCallback` hook. It is
 used to handle the intersection observer logic for lazy loading more data when the last element in
 the list becomes visible. */
  const lastElement = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries?.[0].isIntersecting) {
          limitOffset >= offset && setOffset((prev) => prev + 20);
          console.log("visible");
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  React.useEffect(() => {
    isFetching ? setLoading(true) : setLoading(false);
  }, [isFetching]);

  /* The `React.useEffect` hook is used to perform side effects in a functional component. In this case,
the effect is triggered whenever the `isSuccess` variable changes. */
  React.useEffect(() => {
    data?.transactions &&
      setTransactions((prev) =>
        prev.concat(
          data.transactions.rows as (TRANSACTION_DATA & {
            Rental: RENTAL_DATA;
            User: USER_DATA;
            Room: ROOM_DATA & { Console: CONSOLE_DATA };
          })[]
        )
      );
    data?.transactions.count && setLimitOffset(data.transactions.count);
  }, [isSuccess]);

  return (
    <List sx={{ padding: 2 }}>
      {transactions && transactions.length !== 0 ? (
        transactions.map((data, i) => (
          <TransactionOwnerCard
            ref={i + 1 === transactions.length ? lastElement : undefined}
            key={data.id}
            data={data}
            refecth={refetch}
          />
        ))
      ) : (
        <ListItem alignItems="flex-start" sx={{ minWidth: "100%" }}>
          <Alert variant="filled" severity="warning" sx={{ width: "100%" }}>
            Anda Belum memiliki Transaksi apapun
          </Alert>
        </ListItem>
      )}
      {loading && <TransactionSkeleton />}
    </List>
  );
}
