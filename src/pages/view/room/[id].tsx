/* eslint no-console:"Error" */
import {
  Alert,
  AlertColor,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  IconButtonProps,
  List,
  Snackbar,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { FavoriteBorder, Favorite, Share } from "@mui/icons-material";
import trpc from "@/utils/trpc";
import { useRouter } from "next/dist/client/router";
import ImageCoursel from "@/pages/(__components)/image_coursel";
import PurchaseControl from "@/pages/(__components)/purchase_control";
import { ROOM_DATA } from "@/interfaces/room";
import { CONSOLE_DATA } from "@/interfaces/console";
import RENTAL_DATA from "@/interfaces/rental";
import getSimplifyNumber from "@/lib/simplifyNumber";
import { appRouter } from "@/pages/api/trpc/[trpc]";
import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import superjson from "superjson";
import DetailTransaction from "./(__components)/detail_transaction";
import cookies from "@/lib/cookies";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Transaction from "@/models/transaction";
import { RentalCardRef } from "@/pages/(__components)/rental_card";
import Room from "@/models/room";
import { ERROR_IMAGE_PATH } from "@/static/path";
import TRANSACTION_DATA from "@/interfaces/transaction";
import USER_DATA from "@/interfaces/user";
import Comment, { CommentSkeleton } from "./(__components)/comment_card";
import useAuth from "@/hooks/useAuth";
import RedirectSignin from "@/pages/(__components)/redirect_signin";

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      uuid: undefined,
      username: undefined,
      user_type: undefined,
      email: undefined,
      profile_photo: undefined,
      token: undefined,
    },
    transformer: superjson,
  });

  const id = context.params?.id as string;

  if (isNaN(parseInt(id)))
    return {
      redirect: {
        destination: "/404",
      },
    };

  await helpers.transactions.findAll.ByIdRoom.prefetch({
    where: { id_room: parseInt(id) },
    offset: 0,
  });

  await helpers.findOneRoom.prefetch({ id: parseInt(id) });

  return {
    props: JSON.parse(
      JSON.stringify({
        id,
        trpcState: helpers.dehydrate(),
      })
    ),
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const rooms = await Room.findAll({ attributes: ["id"] }).catch();

  return {
    paths: rooms.map((room) => ({
      params: {
        id: room.id.toString(),
      },
    })),
    fallback: true,
  };
};

export default function index(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter();

  if (!useAuth()) return <RedirectSignin />;
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
  const [user] = React.useState({
    uuid: cookies.get("uuid"),
    user_type: cookies.get("user_type"),
  });

  const [collapse, setCollapse] = React.useState(true);
  const [continueOrder, setContinueOrder] = React.useState(false);
  const [transactions, setTransactions] = React.useState<
    (TRANSACTION_DATA & { User: USER_DATA })[]
  >([]);

  const [loading, setLoading] = React.useState(true);
  const [offset, setOffset] = React.useState(0);
  const [limitOffset, setLimitOffset] = React.useState(0);
  const observer = React.useRef<IntersectionObserver | null>();

  const [fav, setFav] = React.useState<boolean | undefined>();
  const [updateFav, setUpdateFav] = React.useState(false);
  const [alert, setAlert] = React.useState<{
    message: string;
    severity: AlertColor;
  }>();
  const [idFav, setIdFav] = React.useState<number | undefined>();

  /* The above code is a TypeScript React component that defines a function called `lastElement`. This
function is a callback function that takes a parameter `node`. */
  const lastElement = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries?.[0].isIntersecting) {
          limitOffset + 10 >= offset + 10 && setOffset((prev) => prev + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  /* The above code is using the trpc library to make a query to find a specific room. It is passing the
room id and user information as parameters to the query. It also includes options for handling the
query response, such as refetching on reconnect, setting a stale time, retrying the query, and
refetching on mount. It also includes callbacks for handling the query success and error cases. If
the room is not found, it redirects to a 404 page with a message. If there is an error, it sets an
alert with the error message. */
  const { data } = trpc.findOneRoom.useQuery(
    {
      id: parseInt(router.query.id as string),
      id_user: cookies.get("uuid"),
      type: cookies.get("user_type") === "user" ? "user" : "owner",
    },
    {
      refetchOnReconnect: false,
      staleTime: Infinity,
      retry: false,
      refetchOnMount: false,
      onSuccess(data) {
        if (data.room === null)
          router.replace({
            query: {
              message:
                "Ruangan dengan tidak ditemukan \n Id : " + router.query.id,
            },
            pathname: "/404",
          });
      },
      onError(error) {
        setAlert({ message: error.message, severity: "error" });
      },
    }
  );

  /* The above code is using the `useQuery` hook from the `trpc.transactions.findAll.ByIdRoom` API to
fetch transactions data. It is passing an object with a `where` property that specifies the
condition for the query, and an `offset` property to specify the starting point of the query
results. */
  const { isFetching } = trpc.transactions.findAll.ByIdRoom.useQuery(
    {
      where: { id_room: parseInt(router.query.id ?? props.id) },
      offset,
    },
    {
      onSuccess(data) {
        setTransactions(
          transactions.concat(
            data.rows as (TRANSACTION_DATA & { User: USER_DATA })[]
          )
        );
        setLimitOffset(data?.count ?? 0);
      },
    }
  );

  /* The above code is using the `useEffect` hook from React to set the value of `loading` based on the
value of `isFetching`. If `isFetching` is true, then `loading` is set to true, otherwise it is set
to false. This code is likely used to handle loading states in a React component. */
  React.useEffect(() => {
    isFetching ? setLoading(true) : setLoading(false);
  }, [isFetching]);

  const dataRoom = data?.room as ROOM_DATA & {
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
          setAlert({
            message: "Kredensial not valid, silahkan login kembali",
            severity: "error",
          });
          setTimeout(() => router.replace("/signin"), 2000);
        }
        if (error.data?.internalErrors)
          setAlert({
            message: "Internal Server Error",
            severity: "error",
          });
      },
      onSuccess(data: { transaction: Transaction }) {
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

  /* The above code is using a `useQuery` hook from the `trpc.favorite.toogle` module in TypeScript
 React. It is making a query to toggle the favorite status of a room. The query takes several
 parameters including `fav`, `id_room`, `id_user`, and `id`. The `enabled` option is set to
 `updateFav && cookies.get("user_type") !== "owner"`, which means the query will only be enabled if
 `updateFav` is true and the user type is not "owner". The `retry` option is set to `false`, */
  trpc.favorite.toogle.useQuery(
    {
      fav,
      id_room: parseInt(router.query.id as string),
      id_user: cookies.get("uuid") ?? "",
      id: idFav,
    },
    {
      enabled: updateFav && cookies.get("user_type") !== "owner",
      retry: false,
      onSuccess(data) {
        const fav = data as { favorite: boolean; id: number };
        setFav(fav.favorite);
        setAlert({
          message: fav.favorite
            ? "Berhasil ditambahakan ke Favorit"
            : "Berhasil dihapus dari Favorit",
          severity: "success",
        });
        setIdFav(fav.id);
        setUpdateFav(false);
      },
      onError(error) {
        setAlert({ message: error.message, severity: "error" });
      },
    }
  );

  /* The above code is using the `useEffect` hook from React to set the `updateFav` state to `true`
whenever the `fav` state changes. */
  React.useEffect(() => {
    setUpdateFav(true);
  }, [fav]);

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
    setDataTransaction({ ...dataTransaction, times: { checkIn, checkOut } });
  }

  return (
    <>
      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={() => setAlert(undefined)}
      >
        <Alert severity={alert?.severity}>{alert?.message}</Alert>
      </Snackbar>

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
        maxWidth="xs"
      >
        <ImageCoursel
          images={
            dataRoom
              ? dataRoom.room_images?.split(",") ?? [ERROR_IMAGE_PATH]
              : [ERROR_IMAGE_PATH]
          }
          img_styles={
            dataRoom?.active === false ? { filter: "grayscale(100%)" } : {}
          }
          style={{ position: "fixed", top: 60, left: 0, zIndex: 0 }}
        />
        <Container
          sx={{
            height: "100vw",
            width: "100%",
            scrollSnapAlign: "start",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {dataRoom?.active === false && (
            <Button variant="contained" color="error">
              Ruangan tidak aktif
            </Button>
          )}
        </Container>
        <Stack
          sx={{
            padding: 2,
            zIndex: 10,
            position: "relative",
            backgroundColor: "background.paper",
            scrollSnapAlign: "start",
            scrollSnapType: "y mandatory",
            height: "fit-content",
            paddingBottom: 15,
          }}
          spacing={2}
        >
          <Box
            justifyContent="space-between"
            alignItems="center"
            sx={{ display: "flex" }}
          >
            <Button
              variant="contained"
              color={
                data && dataRoom.active
                  ? dataRoom?.is_rented
                    ? "error"
                    : "success"
                  : "error"
              }
              size="small"
            >
              {dataRoom?.active
                ? dataRoom?.is_rented
                  ? "DISEWA"
                  : "TERSEDIA"
                : "TIDAK AKTIF"}
            </Button>
            <IconButton onClick={() => setFav((prev) => !prev)}>
              {fav ? <Favorite sx={{ color: "pink" }} /> : <FavoriteBorder />}
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
                  {dataRoom?.rating?.toFixed(1)}
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
                Rp. {dataRoom?.price_per_hour}{" "}
                <Typography
                  component="span"
                  sx={{ fontWeight: "normal", fontSize: "smaller" }}
                  color="text.secondary"
                >
                  per jam
                </Typography>
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
          <Stack direction="row" justifyContent="space-between">
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setAlert({
                  message: "Link berhasil dicopy diclipboard",
                  severity: "success",
                });
              }}
            >
              <Share />
            </IconButton>
            <ExpandMore
              expand={!collapse}
              onClick={() => setCollapse(!collapse)}
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </Stack>
          <Divider />
          <Box alignItems="center" sx={{ display: "flex" }}>
            <AvatarGroup
              max={4}
              color="text.primary"
              total={dataRoom?.times_booked}
            >
              {transactions.map(
                (data, i) =>
                  i <= 4 && (
                    <Avatar key={i} src={data?.User?.profile_image}>
                      {data?.User?.profile_image}
                    </Avatar>
                  )
              )}
            </AvatarGroup>
            <Typography ml={2} variant="body1" color="text.secondary">
              {dataRoom && getSimplifyNumber(dataRoom.times_booked ?? 0)}+ telah
              menyewa ini
            </Typography>
          </Box>
          <Divider />
          <RentalCardRef
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
          <Typography variant="h6">
            Ulasan
            {transactions.length === 0 && (
              <Alert severity="warning" sx={{ mb: 20 }}>
                Tidak ulasan pada ruangan ini
              </Alert>
            )}
          </Typography>
          <List
            sx={{
              maxHeight: "calc(100vh - 200px)",
              overflowY: "auto",
              scrollSnapAlign: "start",
            }}
          >
            {transactions.length !== 0 &&
              transactions.map((data, i) => (
                <Comment
                  ref={i + 1 === transactions.length ? lastElement : undefined}
                  data={data}
                  key={data.id}
                />
              ))}
            {loading && <CommentSkeleton />}
          </List>
        </Stack>
      </Container>

      {user.user_type === "user" &&
        (order ? (
          <DetailTransaction
            onTimeChange={handleTimeCheckinCheckout}
            price={dataTransaction.prices}
            onCancel={handleCancelOrder}
            onclick_continue={handleContinueOrder}
          />
        ) : (
          dataRoom?.active && (
            <PurchaseControl
              handler={handleHourChange}
              onContinue={() => setOrder(true)}
            />
          )
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
