import {
  Alert,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  IconButtonProps,
  Snackbar,
  Stack,
  styled,
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Transaction from "@/models/transaction";
import { RentalCard } from "@/pages/__components/rental_card";

/**
 * This function creates a server-side helper object to assist with server-side rendering in a
 * TypeScript React application, prefetches data using the helper object, and returns the dehydrated
 * state as props.
 * @param context - The `context` parameter is an object that contains information about the incoming
 * HTTP request in a Next.js server-side rendering environment. It includes properties such as `req`
 * (the HTTP request object), `res` (the HTTP response object), `params` (an object containing dynamic
 * route parameters), and
 * @returns The function `getServerSideProps` is returning an object with a `props` key. The value of
 * the `props` key is an object that contains the `id` and `trpcState` properties. The `id` property is
 * the `id` parameter from the `context` object, and the `trpcState` property is the serialized state
 * of the `helpers` object
 */
export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  /* The above code is creating a server-side helper object using the `createServerSideHelpers`
 function. The helper object is being configured with a router, a context, and a transformer. The
 router is specified as `appRouter`, the context is being created using the `createContext` function
 with the `context` parameter, and the transformer is specified as `superjson`. This helper object
 can be used to assist with server-side rendering in a TypeScript React application. */
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(context),
    transformer: superjson,
  });

  const id = context.params?.id as string;

  await helpers.findAllRoomAssoc.prefetch({ id: parseInt(id) });

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
    times: {
      checkIn: string;
      checkOut: string;
    };
  }>({
    prices: {
      dicount: 0,
      hour: 0,
      total: 0,
    },
    times: {
      checkIn: new Date().toISOString(),
      checkOut: new Date().toISOString(),
    },
  });
  const [order, setOrder] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [user] = React.useState({
    uuid: cookies.get("uuid"),
    user_type: cookies.get("user_type"),
  });
  const [collapse, setCollapse] = React.useState(true);
  const [continueOrder, setContinueOrder] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  React.useEffect(() => {
    setMounted(true);
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

  /* This code is using the `useQuery` hook from the `trpc` library to create a new transaction. It takes
an object with parameters such as `id_rental`, `id_room`, `id_user`, and `rent_time` to create the
transaction. The `enabled` parameter is set to `continueOrder`, which is a state variable that
determines whether the order should continue or not. The `retryOnMount` parameter is set to `true`,
which means that the query will be retried if it fails on mount. */

  trpc.createTransaction.useQuery(
    {
      id_rental: dataRoom?.id_rental ?? -1,
      id_room: dataRoom?.id ?? -1,
      id_user: cookies.get("uuid") ?? "",
      rent_time: dataTransaction.prices.hour,
      time_checkIn: dataTransaction.times.checkIn,
      time_checkOut: dataTransaction.times.checkOut,
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

  /**
   * This function updates the hour and total price in a data object for a transaction.
   * @param {number} hour - The `hour` parameter is a number representing the number of hours selected by
   * the user. It is used to update the `hour` property in the `prices` object of the `dataTransaction`
   * state. It is also used to calculate the `total` price by multiplying the `price_per_hour
   */
  function handleHourChange(hour: number) {
    setDataTransaction((prev) => {
      return {
        ...dataTransaction,
        prices: {
          ...prev.prices,
          hour,
          total: (dataRoom?.price_per_hour ?? 0) * hour,
        },
      };
    });
  }

  /**
   * This function sets the state of "continueOrder" to true.
   */
  function handleContinueOrder() {
    setContinueOrder(true);
  }
  /**
   * The function sets the "order" state to false, indicating that an order has been cancelled.
   */
  function handleCancelOrder() {
    setOrder(false);
  }

  /**
   * This function updates the times of a transaction with the provided check-in and check-out values.
   * @param  - The function `handleTimeCheckinCheckout` takes in an object with two properties: `checkIn`
   * and `checkOut`, both of which are of type `string`. The function then uses these values to update
   * the `times` property of an object called `dataTransaction` using the `setData
   */
  function handleTimeCheckinCheckout({
    checkIn,
    checkOut,
  }: {
    checkIn: string;
    checkOut: string;
  }) {
    console.log(checkIn);
    setDataTransaction({ ...dataTransaction, times: { checkIn, checkOut } });
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
            top: 70,
            left: 0,
            zIndex: 0,
            overflowY: "auto",
          }}
        >
          <ImageCoursel
            images={[(data && dataRoom?.images_directory) ?? ""]}
            style={{ position: "fixed", top: 70, left: 0, zIndex: 0 }}
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
              height: "fit-content",
              paddingBottom: 70,
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
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginLeft: "auto",
                  }}
                >
                  <IconButton sx={{ padding: 0 }}>
                    <StarIcon sx={{ color: "rgb(253, 204, 13)" }} />
                  </IconButton>
                  <Typography variant="body1" color="text.secondary">
                    {dataRoom?.rating}
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  fontWeight={600}
                >
                  Rp. {dataRoom?.price_per_hour}
                </Typography>

                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{ textTransform: "capitalize", color: "text.secondary" }}
                >
                  {dataRoom?.Console.manufactur}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                whiteSpace="pre-line"
                noWrap
                sx={{ maxHeight: collapse ? "10ch" : "fit-content" }}
              >
                {dataRoom?.information}
              </Typography>
            </Box>
            <ExpandMore
              expand={!collapse}
              onClick={() => setCollapse(!collapse)}
            >
              <ExpandMoreIcon />
            </ExpandMore>

            <Divider />
            <Box alignItems="center" sx={{ display: "flex" }}>
              <AvatarGroup max={4} total={dataRoom?.times_booked}>
                <Avatar alt="People" src="/static/images/avatar/1.jpg" />
              </AvatarGroup>
              <Typography ml={2} variant="body1" color="text.secondary">
                {dataRoom && getSimplifyNumber(dataRoom.times_booked ?? 0)}+
                telah menyewa ini
              </Typography>
            </Box>
            <Divider />
            <RentalCard
              data={
                dataRoom
                  ? { ...dataRoom.Rental }
                  : {
                      address: "",
                      description: "",
                      id_owner: "",
                      latitude: 0,
                      longitude: 0,
                      name: "",
                      id: 0,
                      rental_images: "",
                      rental_logo: "",
                      total_rating: 0,
                      total_transaction: 0,
                    }
              }
            />
          </Stack>
        </Container>
      ) : (
        <Loading />
      )}

      {user.user_type === "user" &&
        (order ? (
          <DetailTransaction
            onTimeChange={handleTimeCheckinCheckout}
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

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
