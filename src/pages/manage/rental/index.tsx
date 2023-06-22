import React from "react";
import client from "@/utils/trpc";
import Rental from "@/models/rental";
import AddIcon from "@mui/icons-material/Add";
import { Alert, Fab, List, ListItem } from "@mui/material";
import Link from "next/link";
import cookies from "@/lib/cookies";
import RentalCard from "./__components/card";

export default function index() {
  const { data, refetch } = client.showAllRentalProtected.useQuery(
    {
      uuid: cookies.get("uuid") ?? "",
    },
    { refetchOnMount: true }
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
