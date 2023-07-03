import { Alert, List, ListItem } from "@mui/material";
import React from "react";
import trpc from "@/utils/trpc";
import TRANSACTION_DATA from "@/interfaces/transaction";
import { ROOM_DATA } from "@/interfaces/room";
import RENTAL_DATA from "@/interfaces/rental";
import { CONSOLE_DATA } from "@/interfaces/console";
import TransactionUserCard from "./(__components)/transaction_user.card";
import NoFoundSpalsh from "../(__components)/no_found";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import SuperJSON from "superjson";
import { appRouter } from "../api/trpc/[trpc]";
import createTRPCContext from "../api/trpc/context";
import { TransactionSkeleton } from "./(__components)/transaction_skeleton";
import cookies from "@/lib/cookies";
import useAuth from "@/hooks/useAuth";
import RedirectSignin from "../(__components)/redirect_signin";

/**
 * This function is used to fetch server-side data and return it as props for a React component in a
 * TypeScript React application.
 * @param context - The `context` parameter is an object that contains information about the
 * server-side rendering context. It is of type `GetServerSidePropsContext<{ id_user: string }>`, which
 * means it has a generic type that specifies the shape of the `context.query` object.
 * @returns an object with a "props" property. The value of "props" is an object that contains two
 * properties: "trpcState" and "id_user". The value of "trpcState" is the result of calling the
 * "helpers.dehydrate()" function, and the value of "id_user" is the same as the "id_user" variable
 * from the context.
 */
export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id_user: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: SuperJSON,
  });
  const id_user = context.query?.id_user as string;
  console.log(id_user, "dsasdas");
  await helpers.findAllTransaction.prefetch({ parameters: { id_user } });
  return {
    props: JSON.parse(
      JSON.stringify({
        trpcState: helpers.dehydrate(),
        id_user,
      })
    ),
  };
}

export default function index(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  if (!useAuth()) return <RedirectSignin />;
  const [transactions, setTransactions] = React.useState<
    (TRANSACTION_DATA & {
      Room: ROOM_DATA & { Console: CONSOLE_DATA };
      Rental: RENTAL_DATA;
    })[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [offset, setOffset] = React.useState(0);
  const [limitOffset, setLimitOffset] = React.useState(0);
  const observer = React.useRef<IntersectionObserver | null>();

  /* The code snippet is using the `useQuery` hook from the `trpc` library to fetch data from the server. */
  const { data, refetch, isFetching, isSuccess } =
    trpc.findAllTransaction.useQuery(
      {
        parameters: { id_user: cookies.get("uuid") ?? props.id_user },
        offset,
      },
      { refetchOnMount: false }
    );

  /* The `lastElement` function is a callback function created using the `React.useCallback` hook. It is
used to handle the intersection observer logic for lazy loading more data when the user scrolls to
the end of the list. */
  const lastElement = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries?.[0].isIntersecting) {
          limitOffset >= offset && setOffset((prev) => prev + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  /* The `React.useEffect` hook is used to perform side effects in a functional component. In this case,
the effect is triggered whenever the `isFetching` variable changes. */
  React.useEffect(() => {
    isFetching ? setLoading(true) : setLoading(false);
  }, [isFetching]);

  /* The `React.useEffect` hook is used to perform side effects in a functional component. In this case,
the effect is triggered whenever the `isSuccess` variable changes. */
  React.useEffect(() => {
    setLimitOffset(data?.transactions.count ?? 0);
    if (data?.transactions)
      setTransactions((prev) => {
        return prev.concat(
          data.transactions.rows as (TRANSACTION_DATA & {
            Room: ROOM_DATA & { Console: CONSOLE_DATA };
            Rental: RENTAL_DATA;
          })[]
        );
      });
  }, [isSuccess]);

  return (
    <List sx={{ padding: 2 }}>
      {transactions && transactions.length !== 0 ? (
        transactions.map((data, i) => (
          <>
            {i + 1 === transactions.length ? (
              <TransactionUserCard
                ref={lastElement}
                key={data.id}
                data={data}
                refecth={refetch}
              />
            ) : (
              <TransactionUserCard
                key={data.id}
                data={data}
                refecth={refetch}
              />
            )}
          </>
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
