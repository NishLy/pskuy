import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  Alert,
  Button,
  CardActionArea,
  MenuItem,
  Skeleton,
  Snackbar,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ROOM_DATA } from "@/interfaces/room";
import { CONSOLE_DATA } from "@/interfaces/console";
import Link from "next/dist/client/link";
import StarIcon from "@mui/icons-material/Star";
import cookies from "@/lib/cookies";
import EditIcon from "@mui/icons-material/Edit";
import MoreButton from "@/pages/(__components)/more_button";
import SettingsIcon from "@mui/icons-material/Settings";
import Image from "next/image";
import { ERROR_IMAGE_PATH } from "@/static/path";
import getSimplifyNumber from "@/lib/simplifyNumber";
import RoomControlModal from "@/pages/manage/rental/[rental]/(__components)/room_control_modal";

export interface ROOM_CARD_INTERFACE extends ROOM_DATA {
  Console: CONSOLE_DATA;
  id_rental: number;
  refetch: () => void;
}

export default function RoomCard(props: ROOM_CARD_INTERFACE) {
  const [modal, setModal] = React.useState(false);
  return (
    <>
      <Card
        sx={{
          display: "flex",
          width: "100%",
          height: 140,
          justifyContent: "space-between",
          paddingRight: 2,
        }}
      >
        <CardActionArea sx={{ width: 90, flexShrink: 0, position: "relative" }}>
          <Image
            width={90}
            height={140}
            alt={props.id?.toString() ?? ""}
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
            src={props.room_images?.split(",")[0] ?? ERROR_IMAGE_PATH}
          />
          <Button
            variant="contained"
            size="small"
            color={props.active ? "success" : "error"}
            sx={{ position: "absolute", top: 5, left: 5 }}
          >
            {props.active ? "aktif" : "inactive"}
          </Button>
        </CardActionArea>
        <CardContent sx={{ padding: 0, marginTop: 2, marginLeft: 2 }}>
          <Typography
            variant="h6"
            component="div"
            fontWeight="bold"
            sx={{ textTransform: "capitalize", width: "15ch" }}
            noWrap
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
              color="blue"
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
              mt: 0.5,
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
              <IconButton sx={{ padding: 0, paddingRight: 0.3 }}>
                <VisibilityIcon />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {getSimplifyNumber(props.times_viewed ?? 0)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <IconButton sx={{ padding: 0, paddingX: 0.3 }}>
                <ShoppingCartIcon />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {getSimplifyNumber(props.times_booked ?? 0)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              <IconButton sx={{ padding: 0, paddingX: 0.3 }}>
                <StarIcon sx={{ color: "rgb(253, 204, 13)" }} />
              </IconButton>
              <Typography variant="body1" color="text.secondary">
                {props?.rating?.toFixed(1)}
              </Typography>
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
            <MenuItem onClick={() => setModal(true)}>
              <SettingsIcon sx={{ marginRight: 2 }} />
              kelola Ruangan
            </MenuItem>
          </MoreButton>
        </CardContent>
      </Card>
      {modal && (
        <RoomControlModal
          refetch={props.refetch}
          onClose={setModal}
          open={modal}
          data={props}
        />
      )}
    </>
  );
}

export function RoomCardSkeleton() {
  return (
    <Card sx={{ width: "100%" }}>
      <Stack direction="row" width="100%">
        <Skeleton variant="rectangular" width={100} height={140} />
        <Box padding={2}>
          <Skeleton variant="text" width={200} height={30} />
          <Skeleton variant="text" width={50} height={20} />
          <Skeleton variant="text" width={100} height={20} />
          <Stack direction="row" mt={2} spacing={1}>
            <Skeleton variant="rectangular" width={20} height={20} />
            <Skeleton variant="text" width={40} height={20} />
            <Skeleton variant="rectangular" width={20} height={20} />
            <Skeleton variant="text" width={40} height={20} />
            <Skeleton variant="rectangular" width={20} height={20} />
            <Skeleton variant="text" width={40} height={20} />
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}

export function NoMoreRoom() {
  const [open, setOpen] = React.useState(true);
  return (
    <Snackbar
      autoHideDuration={5000}
      open={open}
      onClose={() => setOpen(false)}
      sx={{ width: "100%" }}
    >
      <Alert variant="filled" severity="info">
        Anda telah mencapai halaman akhir
      </Alert>
    </Snackbar>
  );
}
