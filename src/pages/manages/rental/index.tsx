import Grid from "@mui/material/Grid";
import React from "react";
import client from "@/utils/trpc";
import Rental from "@/models/rental";
import AddIcon from "@mui/icons-material/Add";
import { Alert, Fab, List, ListItem, Typography } from "@mui/material";
import Link from "next/link";
import cookies from "@/lib/cookies";
import RentalCard from "./card";

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   if (!(await verifyToken(ctx.req.cookies.token))) return redirectLogin();

//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     ctx: await createContext(ctx),
//     transformer: superjson, // optional - adds superjson serialization
//   });

//   if (!ctx.req.cookies.token) return redirectLogin();
//   await helpers.showAllRental.prefetch({
//     uuid: ctx.req.cookies.uuid ?? "",
//   });

//   return {
//     props: { uuid: ctx.req.cookies.uuid, trpcState: helpers.dehydrate() },
//   };
// };

export default function index() {
  // props: InferGetServerSidePropsType<typeof getServerSideProps>
  const { data, error } = client.showAllRental.useQuery(
    {
      uuid: cookies.get("uuid") ?? "",
    },
    { staleTime: 1000 * 60 }
  );
  return (
    <>
      <List sx={{ width: "100%" }}>
        {data && data.rentals.length !== 0 ? (
          (data.rentals as Rental[]).map((rental, index) => (
            <ListItem
              alignItems="flex-start"
              key={index + rental.id}
              sx={{ minWidth: "100%" }}
            >
              <RentalCard {...rental} />
            </ListItem>
          ))
        ) : (
          <ListItem alignItems="flex-start" sx={{ minWidth: "100%" }}>
            <Alert
              sx={{
                minWidth: "100%",
              }}
              variant="filled"
              severity="warning"
            >
              Anda Belum Memilik Rental Terdaftar
            </Alert>
          </ListItem>
        )}
        <ListItem sx={{ height: 60 }}></ListItem>
      </List>

      <Link href="/register/rental">
        <Fab
          sx={{ position: "fixed", bottom: "70px", right: "10px" }}
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
      </Link>
    </>
  );
}

export const redirectLogin = () => {
  return {
    redirect: {
      destination: "/signin",
      permanent: false,
    },
  };
};
