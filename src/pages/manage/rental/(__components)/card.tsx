import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import React from "react";
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardContent,
  Typography,
  CardActions,
  MenuItem,
  styled,
  IconButtonProps,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import Link from "next/link";
import { red } from "@mui/material/colors";
import RENTAL_DATA from "@/interfaces/rental";
import MoreButton from "@/pages/(__components)/more_button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import cookies from "@/lib/cookies";
import ImageCoursel from "@/pages/(__components)/image_coursel";
import { BASE_URL } from "@/lib/url";
type Props = RENTAL_DATA & { refecth: () => void };

export default function RentalCard(props: Props) {
  const [collapse, setCollapse] = React.useState(true);
  const [message, setMessage] = React.useState<{
    message: string;
    variant: AlertColor;
  }>();

  return (
    <>
      <Card sx={{ minWidth: "100%" }}>
        <CardHeader
          avatar={
            props.rental_logo ? (
              <Avatar
                sx={{ bgcolor: red[500], width: 50, height: 50 }}
                aria-label={props.name}
                src={props.rental_logo}
              ></Avatar>
            ) : (
              <Avatar
                sx={{ bgcolor: red[500] }}
                aria-label={props.name}
              ></Avatar>
            )
          }
          action={
            <MoreButton>
              <MenuItem disableRipple>
                <VisibilityIcon sx={{ marginRight: 2 }} />
                <Link
                  href={"./rental/" + props.id}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Lihat Ruangan
                </Link>
              </MenuItem>
              <MenuItem disableRipple>
                <EditIcon sx={{ marginRight: 2 }} />
                <Link
                  href={{
                    query: { id: props.id, id_owner: cookies.get("uuid") },
                    pathname: "./rental/" + "edit/" + props.id,
                  }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Edit Rental
                </Link>
              </MenuItem>
            </MoreButton>
          }
          title={props.name}
          sx={{ alignItems: "center", margin: 0 }}
          subheader={props.address}
        />
        <ImageCoursel
          style={{ borderRadius: 0 }}
          images={props.rental_images?.split(",") ?? []}
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            whiteSpace="pre-line"
            noWrap
            sx={{ maxHeight: collapse ? "10ch" : "fit-content" }}
          >
            {props.description}
          </Typography>
        </CardContent>

        <CardActions disableSpacing>
          <IconButton
            aria-label="share"
            onClick={() => {
              navigator.clipboard.writeText(
                BASE_URL + "/view/rental/" + props.id
              );
              setMessage({
                message: "Link copied to clipbord",
                variant: "success",
              });
            }}
          >
            <ShareIcon />
          </IconButton>
          <ExpandMore expand={!collapse} onClick={() => setCollapse(!collapse)}>
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      </Card>

      {message && (
        <Snackbar
          open={true}
          autoHideDuration={5000}
          onClose={() => setMessage(undefined)}
          sx={{ zIndex: 50 }}
        >
          <Alert severity={message?.variant}>{message?.message}</Alert>
        </Snackbar>
      )}
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
