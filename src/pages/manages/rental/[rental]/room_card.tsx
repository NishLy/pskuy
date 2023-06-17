import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {
  FormGroup,
  FormControlLabel,
  Switch,
  CardActionArea,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ROOM_DATA } from "@/interfaces/room";
import { CONSOLE_DATA } from "@/interfaces/console";
import Link from "next/dist/client/link";

export interface ROOM_CARD_INTERFACE extends ROOM_DATA {
  Console: CONSOLE_DATA;
}

export default function RoomControlCard(props: ROOM_CARD_INTERFACE) {
  const theme = useTheme();

  return (
    <Card sx={{ display: "flex", width: "100%" }}>
      <CardActionArea sx={{ width: 160, height: 160, margin: 0 }}>
        <CardMedia
          component="img"
          sx={{ height: "100%", objectFit: "cover", margin: 0 }}
          image={props.images_directory?.replace("./public", "")}
          alt="Live from space album cover"
        />
      </CardActionArea>
      <CardContent sx={{ padding: 0, paddingTop: 2 }}>
        <Typography
          variant="h5"
          component="div"
          fontWeight="bold"
          sx={{ textTransform: "capitalize" }}
        >
          {props.Console.manufactur}
        </Typography>
        <Typography variant="body1" component="div">
          {props.Console.name}
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
        </Box>
      </CardContent>
      <Link href={"./" + props.id_rental + "/room/" + props.id}>
        <CardContent></CardContent>
      </Link>
      {/* <FormGroup>
            </Link>
        <FormControlLabel control={<Switch defaultChecked />} label="Active" />
      </FormGroup> */}
    </Card>
  );
}
