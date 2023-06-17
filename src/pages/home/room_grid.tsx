import { CONSOLE_DATA } from "@/interfaces/console";
import { ROOM_DATA } from "@/interfaces/room";
import trpc from "@/utils/trpc";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Box,
  IconButton,
} from "@mui/material";
import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import RENTAL_DATA from "@/interfaces/rental";
import Link from "next/link";

type Props = {
  category: string;
};

export default function RoomGrid(props: Props) {
  const { data, error } = trpc.findAllRoomAssoc.useQuery({
    console_name: props.category !== "semua" ? props.category : undefined,
  });
  const dataRooms = data?.rooms as (ROOM_DATA & {
    Console: CONSOLE_DATA;
    Rental: RENTAL_DATA;
  })[];
  console.log(data, error);

  return (
    <Grid container paddingX={1} gap={1} justifyContent="space-between">
      {dataRooms && dataRooms.length !== 0
        ? dataRooms.map((data, index) => (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <Grid item xs={5.8} key={data.id! + index}>
              <Card>
                <Link
                  href={{ pathname: "/view/room/" + data.id }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="150"
                      image={data.images_directory}
                      alt="green iguana"
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
                      <Typography
                        gutterBottom
                        variant="body1"
                        component="div"
                        fontWeight="bold"
                        color="primary"
                      >
                        Rp {data.price_per_hour}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {data.times_viewed}
                          </Typography>
                          <IconButton>
                            <VisibilityIcon />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {data.times_viewed}
                          </Typography>
                          <IconButton>
                            <ShoppingCartIcon />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-arrounf",
                            alignItems: "center",
                            marginLeft: "auto",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {data.rating}
                          </Typography>
                          <IconButton>
                            <StarIcon sx={{ color: "rgb(253, 204, 13)" }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Link>
              </Card>
            </Grid>
          ))
        : null}
    </Grid>
  );
}
