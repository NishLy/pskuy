import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { CardActionArea, MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ROOM_DATA } from "@/interfaces/room";
import { CONSOLE_DATA } from "@/interfaces/console";
import Link from "next/dist/client/link";
import StarIcon from "@mui/icons-material/Star";
import cookies from "@/lib/cookies";
import EditIcon from "@mui/icons-material/Edit";
import MoreButton from "@/pages/__components/more_button";
import DeleteIcon from "@mui/icons-material/Delete";

export interface ROOM_CARD_INTERFACE extends ROOM_DATA {
  Console: CONSOLE_DATA;
  id_rental: number;
}

export default function RoomCard(props: ROOM_CARD_INTERFACE) {
  return (
    <Card sx={{ display: "flex", width: "100%" }}>
      <CardActionArea sx={{ width: 160, height: 160, margin: 0 }}>
        <CardMedia
          component="img"
          sx={{ height: "100%", objectFit: "cover", margin: 0 }}
          image={props.images_directory?.split(",")[0]}
        />
      </CardActionArea>
      <CardContent sx={{ padding: 0, marginTop: 2, marginLeft: 2 }}>
        <Typography
          variant="h6"
          component="div"
          fontWeight="bold"
          sx={{ textTransform: "capitalize" }}
        >
          {props.Console.name}
        </Typography>
        <Typography variant="body1" component="div">
          {props.Console.manufactur}
        </Typography>
        <Typography color="text.secondary">
          <Typography
            fontWeight="bold"
            variant="body1"
            display="inline"
            sx={{ textTransform: "capitalize" }}
          >
            Rp. {props.price_per_hour}
          </Typography>{" "}
          per jam
        </Typography>
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
            <Typography variant="body2" color="text.secondary">
              {props.times_viewed}
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
              {props.times_booked}
            </Typography>
            <IconButton>
              <ShoppingCartIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {props?.rating}
            </Typography>
            <IconButton>
              <StarIcon sx={{ color: "rgb(253, 204, 13)" }} />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <CardContent sx={{ padding: 0, marginTop: 1, position: "relative" }}>
        <MoreButton>
          <MenuItem disableRipple>
            <VisibilityIcon sx={{ marginRight: 2 }} />
            <Link
              href={"/view/room/" + props.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Lihat Detail Ruangan
            </Link>
          </MenuItem>
          <MenuItem disableRipple>
            <EditIcon sx={{ marginRight: 2 }} />
            <Link
              href={{
                query: {
                  id: props.id,
                  id_owner: cookies.get("uuid"),
                  id_rental: props.id_rental,
                },
                pathname: "/manage/room/edit/" + props.id,
              }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Edit Ruangan
            </Link>
          </MenuItem>
          <MenuItem>
            <DeleteIcon sx={{ marginRight: 2 }} />
            Hapus Ruangan
          </MenuItem>
        </MoreButton>
      </CardContent>
    </Card>
  );
}
