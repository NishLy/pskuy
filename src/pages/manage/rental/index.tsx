import React from "react";
import client from "@/utils/trpc";
import AddIcon from "@mui/icons-material/Add";
import { Alert, Fab, List, ListItem } from "@mui/material";
import Link from "next/link";
import cookies from "@/lib/cookies";
import RentalCard from "./(__components)/card";
import RENTAL_DATA from "@/interfaces/rental";
import useAuth from "@/hooks/useAuth";
import Unauthorized from "@/pages/(__components)/unauthorized";

export default function index() {
  /* The line `if (!useAuth()) return <RedirectSignin />;` is checking if the user is authenticated. If
 the user is not authenticated, it returns the `<RedirectSignin />` component, which is likely a
 component that redirects the user to the sign-in page. This is a way to protect the content of the
 `index` component and ensure that only authenticated users can access it. */
  if (!useAuth()) return <Unauthorized />;
  /* The code is using the `useQuery` hook from the `client.findAllOwnerRental` object to fetch data from
the server. */
  const { data, refetch } = client.findAllOwnerRental.useQuery(
    {
      uuid: cookies.get("uuid") ?? "",
    },
    { refetchOnMount: true, refetchOnWindowFocus: true }
  );

  return (
    <>
      <List sx={{ width: "100%" }}>
        {data?.rentals && data.rentals?.rows.length !== 0 ? (
          (data.rentals?.rows as RENTAL_DATA[]).map((rental, index) => (
            <ListItem
              alignItems="flex-start"
              key={index + (rental.id ?? 0)}
              sx={{ minWidth: "100%" }}
            >
              <RentalCard {...rental} refecth={refetch} />
            </ListItem>
          ))
        ) : (
          <ListItem alignItems="flex-start" sx={{ minWidth: "100%" }}>
            <Alert variant="filled" severity="warning" sx={{ width: "100%" }}>
              Anda Belum Memiliki Rental Terdaftar
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
