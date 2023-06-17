import cookies from "@/lib/cookies";
import trpc from "@/utils/trpc";
import { Alert, Fab, Link, List, ListItem, Skeleton } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RoomControlCard, { ROOM_CARD_INTERFACE } from "./room_card";

export default function Page() {
  const router = useRouter();
  const result = trpc.showRoomAssociated.useQuery({
    id_rental: parseInt(router.query.rental?.toString() ?? "0"),
    id_owner: cookies.get("uuid") ?? "",
  });

  console.log(result);
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
          <Alert
            sx={{
              minWidth: "100%",
            }}
            variant="filled"
            severity="warning"
          >
            Tidak Ada Ruangan pada Rental ini
          </Alert>
        </ListItem>
      );

    return (result.data.Rooms as ROOM_CARD_INTERFACE[]).map((data, index) => (
      <ListItem
        alignItems="flex-start"
        key={index + data.id!}
        sx={{ minWidth: "100%" }}
      >
        <RoomControlCard {...data} />
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
