import {
  Alert,
  AvatarGroup,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { FavoriteBorder } from "@mui/icons-material";
import trpc from "@/utils/trpc";
import { useRouter } from "next/dist/client/router";
import ImageCoursel from "@/pages/__components/image_coursel";
import PurchaseControl from "@/pages/__components/purchase_control";
import { ROOM_DATA } from "@/interfaces/room";
import { CONSOLE_DATA } from "@/interfaces/console";
import RENTAL_DATA from "@/interfaces/rental";
import getSimplifyNumber from "@/lib/simplifyNumber";
import Loading from "@/pages/__components/loading";
import { appRouter } from "@/pages/api/trpc/[trpc]";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import createContext from "@/pages/api/trpc/__context";
import superjson from "superjson";
import DetailTransaction from "./detail_transaction";
import cookies from "@/lib/cookies";
import { redirectLogin } from "@/pages/manages/rental";
import verifyToken from "@/utils/verifyToken";
import Transaction from "@/models/transaction";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ room: string }>
) {
  if (!(await verifyToken(context.req.cookies.token))) return redirectLogin();

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(context),
    transformer: superjson, // optional - adds superjson serialization
  });

  const id = context.params?.room;

  id && (await helpers.findAllRoomAssoc.prefetch({ id: parseInt(id) }));

  return {
    props: JSON.parse(
      JSON.stringify({
        id,
        trpcState: helpers.dehydrate(),
      })
    ),
  };
}

export default function index(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const [dataTransaction, setDataTransaction] = React.useState<{
    prices: { dicount: number; hour: number; total: number };
  }>({
    prices: {
      dicount: 0,
      hour: 0,
      total: 0,
    },
  });
  const [order, setOrder] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [user] = React.useState({
    uuid: cookies.get("uuid"),
    user_type: cookies.get("user_type"),
  });
  const [continueOrder, setContinueOrder] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  React.useEffect(() => {
    setMounted(true);
    if (!user.uuid) router.replace("/signin");
  }, []);

  const { data } = trpc.findAllRoomAssoc.useQuery(
    {
      id: parseInt(props["id"]),
    },
    {
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: 120 * 1000,
    }
  );

  const dataRoom = data?.rooms[0] as ROOM_DATA & {
    Console: CONSOLE_DATA;
    Rental: RENTAL_DATA;
  };

  const transactionResult = trpc.createTransaction.useQuery(
    {
      id_rental: dataRoom?.id_rental ?? -1,
      id_room: dataRoom?.id ?? -1,
      id_user: cookies.get("uuid") ?? "",
      rent_time: dataTransaction.prices.hour,
    },
    {
      enabled: continueOrder,
      retryOnMount: true,
      onError(error) {
        if (error.data?.unauthorized) {
          setError("Kredensial not valid, silahkan login kembali");
          setTimeout(() => router.replace("/signin"), 2000);
        }
        if (error.data?.internalErrors) setError("Upps ada masalah diserver");
      },
      onSuccess(data: { transaction: Transaction }) {
        console.log(data);
        setContinueOrder(true);
        router.push({
          query: {
            id: data.transaction.id,
            id_user: data.transaction.id_user,
            id_rental: data.transaction.id_rental,
            id_room: data.transaction.id_room,
          },
          pathname: "/view/transaction/" + data.transaction.id,
        });
      },
    }
  );

  console.log(transactionResult);

  function handleHourChange(hour: number) {
    setDataTransaction((prev) => {
      return {
        prices: {
          ...prev.prices,
          hour,
          total: (dataRoom?.price_per_hour ?? 0) * hour,
        },
      };
    });
  }
  function handleContinueOrder() {
    setContinueOrder(true);
  }
  function handleCancelOrder() {
    setOrder(false);
  }

  return (
    <>
      {continueOrder && <Loading />}
      <Snackbar open={!!error} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
      {mounted ? (
        <Container
          sx={{
            padding: 0,
            scrollSnapType: "y mandatory",
            maxHeight: "100vh",
            position: "fixed",
            top: 60,
            left: 0,
            zIndex: 0,
            overflowY: "auto",
          }}
        >
          <ImageCoursel
            images={[(data && dataRoom?.images_directory) ?? ""]}
            style={{ position: "fixed", top: 60, left: 0, zIndex: 0 }}
          />
          <Container
            sx={{ height: "100vw", scrollSnapAlign: "start" }}
          ></Container>
          <Stack
            sx={{
              padding: 2,
              zIndex: 10,
              position: "relative",
              backgroundColor: "background.paper",
              scrollSnapAlign: "start",
            }}
            spacing={2}
          >
            <Divider />
            <Box
              justifyContent="space-between"
              alignItems="center"
              sx={{ display: "flex" }}
            >
              <Button
                variant="contained"
                color={data && dataRoom?.is_rented ? "error" : "success"}
                size="small"
              >
                {dataRoom?.is_rented ? "DISEWA" : "TERSEDIA"}
              </Button>
              <IconButton>
                <FavoriteBorder />
              </IconButton>
            </Box>
            <Box>
              <Box
                justifyContent="space-between"
                alignItems="center"
                sx={{ display: "flex" }}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  fontWeight="bold"
                  sx={{ textTransform: "capitalize" }}
                >
                  {dataRoom?.Console.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginLeft: "auto",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {dataRoom?.rating}
                  </Typography>
                  <IconButton>
                    <StarIcon sx={{ color: "rgb(253, 204, 13)" }} />
                  </IconButton>
                </Box>
              </Box>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ textTransform: "capitalize" }}
              >
                {dataRoom?.Console.manufactur}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dataRoom?.information}
              </Typography>
            </Box>

            <Box>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                fontWeight={600}
              >
                Rp. {dataRoom?.price_per_hour}
              </Typography>
            </Box>

            <Divider />
            <Box alignItems="center" sx={{ display: "flex" }}>
              <AvatarGroup max={4} total={dataRoom?.times_booked}>
                {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */}
                {/* <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
              <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
              <Avatar
                alt="Trevor Henderson"
                src="/static/images/avatar/5.jpg"
              /> */}
              </AvatarGroup>
              <Typography ml={2} variant="body1" color="text.secondary">
                {dataRoom && getSimplifyNumber(dataRoom.times_booked ?? 0)}+
                telah menyewa ini
              </Typography>
            </Box>

            <Divider />
          </Stack>
        </Container>
      ) : (
        <Loading />
      )}

      {user.user_type === "user" &&
        (order ? (
          <DetailTransaction
            price={dataTransaction.prices}
            onCancel={handleCancelOrder}
            onclick_continue={handleContinueOrder}
          />
        ) : (
          <PurchaseControl
            handler={handleHourChange}
            onContinue={() => setOrder(true)}
          />
        ))}
    </>
  );
}
