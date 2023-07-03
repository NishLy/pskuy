import cookies from "@/lib/cookies";
import trpc from "@/utils/trpc";
import { Alert, Fab, Link, List, ListItem } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import RoomCard, {
  NoMoreRoom,
  ROOM_CARD_INTERFACE,
  RoomCardSkeleton,
} from "./(__components)/room_card";
import Unauthorized from "@/pages/(__components)/unauthorized";
import useAuth from "@/hooks/useAuth";

export default function Page() {
  if (!useAuth()) return <Unauthorized />;
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [rooms, setRooms] = React.useState<ROOM_CARD_INTERFACE[]>([]);
  const [offset, setOffset] = React.useState(0);
  const [limitOffset, setLimitOffset] = React.useState(0);
  const observer = React.useRef<IntersectionObserver | null>();

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
  /* The code is using the `useQuery` hook from the `trpc.showRoomAssociated` object to fetch data from
the server. */

  const { data, refetch, isFetching, isSuccess } =
    trpc.showRoomAssociated.useQuery({
      parameters: {
        id_rental: parseInt(router.query.rental?.toString() ?? "0"),
        id_owner: cookies.get("uuid") ?? "",
      },
      offset,
    });

  /* The `React.useEffect` hook is used to perform side effects in a functional component. In this
  case, the effect is triggered whenever the `isFetching` variable changes. */
  React.useEffect(() => {
    isFetching ? setLoading(true) : setLoading(false);
  }, [isFetching]);

  /* The `React.useEffect` hook is used to perform side effects in a functional component. In this case,
the effect is triggered whenever the `isSuccess` variable changes. */
  React.useEffect(() => {
    data?.rooms &&
      setRooms(rooms.concat(data.rooms.rows as ROOM_CARD_INTERFACE[]));

    data?.rooms.count && setLimitOffset(data.rooms.count);
  }, [isSuccess]);

  /* The `RenderContent` function is responsible for rendering the content of the page based on the
  `rooms` data. */
  function RenderContent() {
    if (rooms.length === 0)
      return (
        <ListItem alignItems="flex-start" sx={{ minWidth: "100%" }}>
          <Alert variant="filled" severity="warning" sx={{ width: "100%" }}>
            Rental ini belum memilik Ruangan Terdaftar
          </Alert>
        </ListItem>
      );

    return (rooms as ROOM_CARD_INTERFACE[]).map((data, index) => (
      <ListItem
        alignItems="flex-start"
        key={index + (data.id ?? 0)}
        ref={index + 1 === rooms.length ? lastElement : undefined}
        sx={{ minWidth: "100%" }}
      >
        <RoomCard {...data} refetch={refetch} />
      </ListItem>
    ));
  }

  return (
    <>
      <List sx={{ width: "100%", maxWidth: "xs" }}>
        {RenderContent()}
        <ListItem>
          {loading && <RoomCardSkeleton />}
          {limitOffset <= offset && <NoMoreRoom />}
        </ListItem>
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
