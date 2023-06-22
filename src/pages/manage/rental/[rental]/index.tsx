import cookies from "@/lib/cookies";
import trpc from "@/utils/trpc";
import { Alert, Fab, Link, List, ListItem, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RoomCard, { ROOM_CARD_INTERFACE } from "./__components/room_card";

export default function Page() {
  const router = useRouter();
  const result = trpc.showRoomAssociated.useQuery({
    id_rental: parseInt(router.query.rental?.toString() ?? "0"),
    id_owner: cookies.get("uuid") ?? "",
  });

  function RenderContent() {
    if (!result.data?.Rooms)
      return (
        <>
          <ListItem alignItems="flex-start" sx={{ minWidth: "100%" }}>
            <Skeleton variant="rectangular" height={150} />
          </ListItem>
          <ListItem alignItems="flex-start" sx={{ minWidth: "100%" }}>
            <Skeleton variant="rectangular" height={150} />
          </ListItem>
          <ListItem alignItems="flex-start" sx={{ minWidth: "100%" }}>
            <Skeleton variant="rectangular" height={150} />
          </ListItem>
          <ListItem alignItems="flex-start" sx={{ minWidth: "100%" }}>
            <Skeleton variant="rectangular" height={150} />
          </ListItem>
        </>
      );
    if (result.data?.Rooms.length === 0)
      return (
        <ListItem alignItems="flex-start" sx={{ minWidth: "100%" }}>
          <Alert variant="filled" severity="warning" sx={{ width: "100%" }}>
            Rental ini belum memilik Ruangan Terdaftar
          </Alert>
        </ListItem>
      );

    return (result.data.Rooms as ROOM_CARD_INTERFACE[]).map((data, index) => (
      <ListItem
        alignItems="flex-start"
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        key={index + data.id!}
        sx={{ minWidth: "100%" }}
      >
        <RoomCard {...data} />
      </ListItem>
    ));
  }

  return (
    <>
      <List sx={{ width: "100%" }}>
        {RenderContent()}
        <ListItem sx={{ height: 80 }}></ListItem>
      </List>
      <Link href={"/register/room/" + router.query.rental?.toString()}>
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
