import { CONSOLE_DATA } from "@/interfaces/console";
import { ROOM_DATA } from "@/interfaces/room";
import trpc from "@/utils/trpc";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
  Box,
  IconButton,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import RENTAL_DATA from "@/interfaces/rental";
import Link from "next/link";
import Image from "next/image";
import getSimplifyNumber from "@/lib/simplifyNumber";
import NoFoundSpalsh from "./no_found";

type Props = {
  category: string;
  id_rental?: number;
  active?: boolean;
};

export default function RoomGrid(props: Props) {
  const [loading, setLoading] = React.useState(true);
  const [rooms, setRooms] = React.useState<
    (ROOM_DATA & {
      Console: CONSOLE_DATA;
      Rental: RENTAL_DATA;
    })[]
  >([]);
  const [offset, setOffset] = React.useState(0);
  const [limitOffset, setLimitOffset] = React.useState(0);
  const observer = React.useRef<IntersectionObserver | null>();

  const lastElement = React.useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries?.[0].isIntersecting)
          limitOffset + 10 >= offset + 10 && setOffset((prev) => prev + 10);
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const { data, isFetching } = trpc.findAllRoomAssoc.useQuery(
    {
      parameters: {
        console_name: props.category !== "semua" ? props.category : undefined,
        id_rental: props.id_rental,
        active: props.active,
      },
      offset,
    },
    {
      enabled: props.category !== "",
    }
  );

  React.useEffect(() => {
    isFetching ? setLoading(true) : setLoading(false);
    data?.rooms &&
      setRooms(
        rooms
          ?.concat(
            data?.rooms as (ROOM_DATA & {
              Console: CONSOLE_DATA;
              Rental: RENTAL_DATA;
            })[]
          )
          .sort(
            (a, b) =>
              (b.active as unknown as number) - (a.active as unknown as number)
          )
      );
    data?.count && setLimitOffset(data.count);
  }, [isFetching]);

  return (
    <>
      <Grid container padding={1} gap={1} justifyContent="space-between">
        {rooms && rooms.length !== 0 ? (
          rooms.map((data, index) => (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <Grid
              ref={rooms.length === index + 1 ? lastElement : undefined}
              item
              xs={5.8}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              key={data.id! + index}
            >
              <Card>
                <Link
                  href={{ pathname: "/view/room/" + data.id }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <CardActionArea>
                    <Image
                      width="190"
                      height="190"
                      placeholder="blur"
                      blurDataURL="/images/blur.webp"
                      style={{
                        aspectRatio: "1/1",
                        objectFit: "cover",
                        minWidth: "100%",
                        minHeight: "100%",
                        filter: data.active ? "none" : "grayscale(100%)",
                      }}
                      src={
                        data.room_images?.split(",")[0] ??
                        "/images/Error/404_NOT_FOUND.avif"
                      }
                      alt={data.id?.toString() ?? ""}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{ textTransform: "capitalize", marginBottom: 0 }}
                      >
                        {data.Rental && data.Rental.name}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography
                          gutterBottom
                          variant="body1"
                          component="div"
                          mr={5}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {data.Console && data.Console.manufactur}
                        </Typography>
                        <Typography
                          gutterBottom
                          noWrap
                          variant="body1"
                          component="div"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {data.Console && data.Console.name}
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          gutterBottom
                          variant="body1"
                          component="div"
                          fontWeight="bold"
                          color="primary"
                          mb={0}
                        >
                          Rp {data.price_per_hour}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <IconButton>
                            <StarIcon sx={{ color: "rgb(253, 204, 13)" }} />
                          </IconButton>
                          <Typography variant="body2" color="text.secondary">
                            {data.rating?.toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <IconButton>
                            <VisibilityIcon />
                          </IconButton>
                          <Typography variant="body2" color="text.secondary">
                            {getSimplifyNumber(data.times_viewed ?? 0)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <IconButton>
                            <ShoppingCartIcon />
                          </IconButton>
                          <Typography variant="body2" color="text.secondary">
                            {getSimplifyNumber(data.times_booked ?? 0)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))
        ) : (
          <NoFoundSpalsh />
        )}
        {loading && (
          <>
            <Grid item>
              <Card sx={{ padding: 1 }}>
                <Stack spacing={1}>
                  <Skeleton variant="rectangular" width={160} height={160} />
                  <Skeleton variant="text" width={160} height={30} />
                  <Skeleton variant="text" width={160} height={20} />
                  <Stack direction="row" justifyContent="space-between">
                    <Skeleton variant="text" width={60} height={20} />
                    <Skeleton variant="text" width={60} height={20} />
                  </Stack>
                  <Skeleton variant="text" width={160} height={20} />
                </Stack>
              </Card>
            </Grid>
            <Grid item>
              <Card sx={{ padding: 1 }}>
                <Stack spacing={1}>
                  <Skeleton variant="rectangular" width={160} height={160} />
                  <Skeleton variant="text" width={160} height={30} />
                  <Skeleton variant="text" width={160} height={20} />
                  <Stack direction="row" justifyContent="space-between">
                    <Skeleton variant="text" width={60} height={20} />
                    <Skeleton variant="text" width={60} height={20} />
                  </Stack>
                  <Skeleton variant="text" width={160} height={20} />
                </Stack>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      <Snackbar open={offset >= limitOffset} autoHideDuration={5000}>
        <Alert severity="warning">Tidak ada lagi data tersedia :(</Alert>
      </Snackbar>
    </>
  );
}
